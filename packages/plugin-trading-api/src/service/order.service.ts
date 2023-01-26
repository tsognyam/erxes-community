import {
  IpoType,
  OrderCondition,
  OrderStatus,
  OrderTxnType,
  StockConst,
  StockTypeConst
} from '../constants/stock';
import { TransactionConst } from '../constants/wallet';
import OrderRepository from '../repository/order.repository';
import UserMCSDAccountRepository from '../repository/user/user.mcsd.repository';
import CustFeeService from './custfee.service';
import Helper from '../middleware/helper.service';
import StockService from './stock.service';
import OrderValidator from './validator/order.validator';
import StockTransactionValidator from './validator/wallet/stock.transaction.validator';
import StockWalletValidator from './validator/wallet/stock.wallet.validator';
import { TransactionValidator } from './validator/wallet/transaction.validator';
import StockTransactionService from './wallet/stock.transaction.service';
import TransactionService from './wallet/transaction.service';
import WalletService from './wallet/wallet.service';
import { ErrorCode, CustomException } from '../exception/error-code';
class OrderService {
  private orderValidator: OrderValidator;
  private orderRepository: OrderRepository;
  private walletService: WalletService;
  private stockService: StockService;
  private custFeeService: CustFeeService;
  private transactionService: TransactionService;
  private stockTransactionService: StockTransactionService;
  private tranValidator: TransactionValidator;
  private stockTranValidator: StockTransactionValidator;
  private userMCSDAccountRepository: UserMCSDAccountRepository;
  private stockWalletValidator: StockWalletValidator;
  constructor() {
    this.orderValidator = new OrderValidator();
    this.orderRepository = new OrderRepository();
    this.walletService = new WalletService();
    this.stockService = new StockService();
    this.custFeeService = new CustFeeService();
    this.transactionService = new TransactionService();
    this.stockTransactionService = new StockTransactionService();
    this.tranValidator = new TransactionValidator();
    this.stockTranValidator = new StockTransactionValidator();
    this.userMCSDAccountRepository = new UserMCSDAccountRepository();
    this.stockWalletValidator = new StockWalletValidator();
  }
  get = async data => {
    var order = await this.orderValidator.validateGet(data);
    return order;
  };
  create = async (data, live = true) => {
    let stockdata = await this.stockService.getStockCode({
      stockcode: data.stockcode
    });

    data.ipo = stockdata.ipo;
    data.status = OrderStatus.STATUS_NEW;
    // data.fee = 0.1;
    data.fee = await this.custFeeService.getFee(data.userId, data.stockcode);
    console.log('fee=', data.fee);
    // data.txndate = new Date();

    if (stockdata.stocktypeId == StockTypeConst.PCKG) {
      return await this.createPackage(data, stockdata);
    }
    if (stockdata.ipo == StockConst.IPO)
      return await this.createIPO(data, stockdata);
    else return await this.createSO(data, stockdata, live);
  };
  createSO = async (data, stockdata, live = true) => {
    let params: any = {
      userId: data.userId,
      currencyCode: stockdata.currencyCode
    };

    // let amount = camount + feeamount;
    const wallets = await this.walletService.getWalletWithUser(params);
    if (wallets.length == 0) {
      CustomException(ErrorCode.WalletNotFoundException);
    }
    let nominalWallet = await this.walletService.getNominalWallet({
      currencyCode: stockdata.currencyCode
    });
    data.walletId = wallets[0].id;

    let dataValid = await this.orderValidator.validateCreateSO(data);
    let userMCSD = await this.userMCSDAccountRepository.findFirst({
      userId: data.userId
    });
    if (!userMCSD) {
      CustomException(ErrorCode.NotFoundMCSDAccountException);
    }
    if (dataValid.txntype == OrderTxnType.Buy) {
      let camount = dataValid.price * dataValid.cnt;
      let feeamount = camount * (dataValid.fee / 100);
      params = {
        senderWalletId: wallets[0].id,
        receiverWalletId: nominalWallet.id,
        type: TransactionConst.TYPE_W2W,
        amount: camount,
        feeAmount: feeamount
      };
      const transaction = await this.transactionService.w2w(params);
      dataValid.tranOrderId = transaction.id;
    } else {
      params = {
        senderWalletId: wallets[0].id,
        receiverWalletId: nominalWallet.id,
        stockCount: data.cnt,
        stockCode: stockdata.stockcode
      };
      const transaction = await this.stockTransactionService.w2w(params);

      dataValid.stockOrderId = transaction.id;
    }

    dataValid.originalCnt = dataValid.cnt;
    dataValid.descr = 'Шинэ';
    dataValid.descr2 = 'New';
    let order = await this.orderRepository.create(dataValid);

    if (stockdata.stocktypeId == StockTypeConst.SEC) {
      if (live) {
        let edata = {
          otype: '1',
          fullPrefix: userMCSD.fullPrefix,
          orderid: order.txnid.toString(),
          symbol: stockdata.externalid,
          type: order.ordertype.toString(),
          side: order.txntype.toString(),
          tif: order.condid.toString(),
          price: order.price.toString(),
          quantity: order.cnt.toString(),
          expiredate: Helper.dateToString(order.enddate)
        };
        // if (mseSocket.getSocket().isConnected()) {
        //     let socket = mseSocket.getSocket();
        //     socket.request(edata);
        // }
      }
    } else {
      order.status = OrderStatus.STATUS_NEW;
      order.ostatus = OrderStatus.STATUS_RECEIVE;
    }

    order.orderno = order.txnid.toString();
    let res = await this.orderRepository.update(order);

    return res;
  };
  createPackage = async (data, stockdata) => {
    //Check balance

    let dataValid = await this.orderValidator.validateCreatePackage(data);
    let params: any = {
      userId: data.userId,
      currencyCode: stockdata.currencyCode
    };
    const wallets = await this.walletService.getWalletWithUser(params);
    if (wallets.length == 0) {
      CustomException(ErrorCode.WalletNotFoundException);
    }
    dataValid.walletId = wallets[0].id;
    let userMCSD = await this.userMCSDAccountRepository.findFirst({
      userId: data.userId
    });
    if (!userMCSD) {
      CustomException(ErrorCode.NotFoundMCSDAccountException);
    }
    let nominalWallet = await this.walletService.getNominalWallet({
      currencyCode: stockdata.currencyCode
    });
    if (dataValid.txntype == OrderTxnType.Buy) {
      let camount = dataValid.price * dataValid.cnt;
      let feeamount = camount * (dataValid.fee / 100);
      params = {
        senderWalletId: wallets[0].id,
        receiverWalletId: nominalWallet.id,
        type: TransactionConst.TYPE_W2W,
        amount: camount,
        feeAmount: feeamount
      };
      const transaction = await this.transactionService.w2w(params);
      dataValid.tranOrderId = transaction.id;
    } else {
      params = {
        senderWalletId: wallets[0].id,
        receiverWalletId: nominalWallet.id,
        stockCount: dataValid.cnt,
        stockCode: stockdata.stockcode
      };
      const transaction = await this.stockTransactionService.w2w(params);

      dataValid.stockOrderId = transaction.id;
    }
    dataValid.startdate = stockdata.startdate;
    dataValid.enddate = stockdata.enddate;
    dataValid.ordertype = 2;
    dataValid.txntype = OrderTxnType.Buy;
    dataValid.condid = OrderCondition.Day;
    dataValid.status = OrderStatus.STATUS_RECEIVE;
    dataValid.ostatus = OrderStatus.STATUS_NEW;
    dataValid.descr = 'Хүлээн авсан';
    dataValid.descr2 = 'Received';
    let order = await this.orderRepository.create(dataValid);
    order.orderno = order.txnid.toString();
    let res = await this.orderRepository.update(order);
    return res;
  };

  createIPO = async (data, stockdata) => {
    //Check balance
    data.startdate = stockdata.startdate;
    data.enddate = stockdata.enddate;
    data.ordertype = 2;
    data.txntype = OrderTxnType.Buy;
    data.condid = OrderCondition.Day;
    data.originalCnt = data.cnt;
    data.descr = 'Шинэ';
    data.descr2 = 'New';
    if (stockdata.ipotype == IpoType.FIXED_PRICE) {
      data.price = parseFloat(stockdata.stockprice);
    }
    let dataValid = await this.orderValidator.validateCreateIPO(data);
    let params = {
      userId: data.userId,
      currencyCode: 'MNT'
    };
    const wallets = await this.walletService.getWalletWithUser(params);
    if (wallets.length == 0) {
      CustomException(ErrorCode.WalletNotFoundException);
    }
    dataValid.walletId = wallets[0].id;
    let userMCSD = await this.userMCSDAccountRepository.findFirst({
      userId: data.userId
    });
    if (!userMCSD) {
      CustomException(ErrorCode.NotFoundMCSDAccountException);
    }

    dataValid.status = OrderStatus.STATUS_RECEIVE;
    dataValid.ostatus = OrderStatus.STATUS_NEW;
    dataValid.descr = 'IPO System хүлээн авсан';
    dataValid.descr2 = 'Received';
    console.log('dataValid', dataValid);
    let order = await this.orderRepository.create(dataValid);
    order.orderno = order.txnid.toString();
    let res = await this.orderRepository.update(order);
    return res;
  };

  updateOrder = async data => {
    // if (mseSocket.getSocket().isConnected() != 1)
    //   CustomException(ErrorCode.NotConnectedtoMITException);
    let order = await this.orderRepository.findOne(data.txnid);
    console.log('order=', order);
    if (!order) CustomException(ErrorCode.OrderNotFoundException);
    let stockdata = await this.stockService.getStockCode({
      stockcode: order.stockcode
    });
    // data.status = '0';
    data.userId = order.userId;
    data.fee = await this.custFeeService.getFee(order.userId, order.stockcode);
    if (stockdata.ipo == StockConst.IPO)
      CustomException(ErrorCode.IpoCannotUpdateException);
    else return await this.updateSO(data, stockdata, order);
  };
  updateSO = async (data, stockdata, order) => {
    let dataValid = await this.orderValidator.validateUpdateSO(data);
    let userMCSD = await this.userMCSDAccountRepository.findFirst({
      userId: data.userId
    });
    if (!userMCSD) {
      CustomException(ErrorCode.NotFoundMCSDAccountException);
    }

    if (
      order.status != OrderStatus.STATUS_NEW &&
      order.status != OrderStatus.STATUS_RECEIVE
    ) {
      CustomException(ErrorCode.OrderCannotUpdateException);
    }
    //Wallet balance check

    let params: any = {
      userId: order.userId,
      currencyCode: stockdata.currencyCode
    };
    const wallets = await this.walletService.getWalletWithUser(params);
    let nominalWallet = await this.walletService.getNominalWallet({
      currencyCode: stockdata.currencyCode
    });
    if (order.txntype == OrderTxnType.Buy) {
      let camount = dataValid.price * dataValid.cnt;
      let feeamount = camount * (dataValid.fee / 100);
      let oldcamount = order.price * order.cnt;
      let oldfeeamount = oldcamount * (order.fee / 100);
      this.tranValidator.checkBalance(
        wallets[0],
        camount + feeamount,
        false,
        oldcamount + oldfeeamount
      );
      params = {
        orderId: order.tranOrderId,
        confirm: 0
      };
      await this.transactionService.confirmTransaction(params);
      params = {
        senderWalletId: wallets[0].id,
        receiverWalletId: nominalWallet.id,
        type: TransactionConst.TYPE_W2W,
        amount: camount,
        feeAmount: feeamount
      };
      const transaction = await this.transactionService.w2w(params);

      order.tranOrderId = transaction.id;
    } else {
      params = {
        orderId: order.stockOrderId,
        confirm: 0
      };
      const senderBalance = this.stockWalletValidator.validateBalanceWithWallet(
        {
          walletId: wallets[0].id,
          stockCode: stockdata.stockcode
        }
      );
      this.stockTranValidator.checkBalance(
        wallets[0],
        senderBalance,
        data.cnt,
        false,
        order.cnt
      );
      await this.transactionService.confirmTransaction(params);
      params = {
        senderWalletId: wallets[0].id,
        receiverWalletId: nominalWallet.id,
        stockCount: data.cnt,
        stockCode: stockdata.stockcode
      };
      const transaction = await this.stockTransactionService.w2w(params);

      data.stockOrderId = transaction.id;
    }

    order.price = dataValid.price;
    order.cnt = dataValid.cnt;
    order.originalCnt = dataValid.cnt;
    order.fee = dataValid.fee;
    order.oupdatedate = new Date();
    order.oupdateUserId = dataValid.userId;
    order.descr = 'Засварлах хүсэлт илгээсэн';
    order.descr2 = 'Sent request to update';
    if (
      stockdata.stocktypeId == StockTypeConst.SEC &&
      order.status == OrderStatus.STATUS_RECEIVE
    ) {
      order.ostatus = OrderStatus.STATUS_UPDATE;
    }

    let res = await this.orderRepository.update(order);
    if (stockdata.stocktypeId != StockTypeConst.SEC) {
      return res;
    }
    let edata;
    if (order.status == OrderStatus.STATUS_RECEIVE) {
      edata = {
        otype: '2',
        fullPrefix: userMCSD.fullPrefix,
        orderid: order.txnid.toString(),
        symbol: stockdata.externalid,
        type: order.ordertype.toString(),
        side: order.txntype.toString(),
        tif: order.condid.toString(),
        price: order.price.toString(),
        quantity: order.cnt.toString(),
        expiredate: Helper.dateToString(order.enddate),
        ordersubid: order.mseOrderId.toString()
      };
    } else {
      edata = {
        otype: '1',
        fullPrefix: userMCSD.fullPrefix,
        orderid: order.txnid.toString(),
        symbol: stockdata.externalid,
        type: order.ordertype.toString(),
        side: order.txntype.toString(),
        tif: order.condid.toString(),
        price: order.price.toString(),
        quantity: order.cnt.toString(),
        expiredate: Helper.dateToString(order.enddate)
      };
    }

    // if (mseSocket.getSocket().isConnected()) {
    //     let socket = mseSocket.getSocket();
    //     socket.request(edata);
    // }

    return res;
  };
  executeSO = async data => {};
  cancelPckg = async (data, order) => {
    let dataValid = await this.orderValidator.validateCancelSO(data);
    if (order.txntype == OrderTxnType.Buy) {
      let params = {
        orderId: order.tranOrderId,
        confirm: 0
      };
      await this.transactionService.confirmTransaction(params);
    } else {
      let params = {
        orderId: order.stockOrderId,
        confirm: 0
      };
      await this.stockTransactionService.confirmTransaction(params);
    }

    order.oupdatedate = new Date();
    order.oupdateUserId = dataValid.userId;
    order.ostatus = OrderStatus.STATUS_CANCEL;
    order.status = OrderStatus.STATUS_CANCEL;
    order.descr = 'Цуцлагдсан';
    order.descr2 = 'Cancelled';
    let res = await this.orderRepository.update(order);
    return res;
  };
  cancelSO = async (data, stockdata, order) => {
    // if (mseSocket.getSocket().isConnected() != 1)
    //   CustomException(ErrorCode.NotConnectedtoMITException);
    let dataValid = await this.orderValidator.validateCancelSO(data);
    let userMCSD = await this.userMCSDAccountRepository.findFirst({
      userId: order.userId
    });
    if (!userMCSD) {
      CustomException(ErrorCode.NotFoundMCSDAccountException);
    }
    if (order.status == OrderStatus.STATUS_NEW) {
      // CustomException(ErrorCode.OrderCannotCancelException);
      if (order.txntype == OrderTxnType.Buy) {
        let params = {
          orderId: order.tranOrderId,
          confirm: 0
        };
        await this.transactionService.confirmTransaction(params);
      } else {
        let params = {
          orderId: order.stockOrderId,
          confirm: 0
        };
        await this.stockTransactionService.confirmTransaction(params);
      }

      order.oupdatedate = new Date();
      order.oupdateUserId = dataValid.userId;
      order.ostatus = OrderStatus.STATUS_CANCEL;
      order.status = OrderStatus.STATUS_CANCEL;
      order.descr = 'Цуцлагдсан';
      order.descr2 = 'Cancelled';
      let res = await this.orderRepository.update(order);
      return res;
    }
    if (order.status == OrderStatus.STATUS_RECEIVE) {
      //let socket = mseSocket.getSocket();

      order.oupdatedate = new Date();
      order.oupdateUserId = dataValid.userId;
      order.ostatus = OrderStatus.STATUS_CANCEL;
      order.descr = 'Цуцлах хүсэлт илгээсэн';
      order.descr2 = 'Sent request to cancel';
      let res = await this.orderRepository.update(order);

      let edata = {
        otype: '3',
        fullPrefix: userMCSD.fullPrefix,
        orderid: order.txnid.toString(),
        side: order.txntype.toString(),
        symbol: stockdata.externalid,
        ordersubid: order.mseOrderId.toString()
      };
      // if (mseSocket.getSocket().isConnected()) {
      //     let socket = mseSocket.getSocket();
      //     socket.request(edata);
      // }

      return res;
    }
    CustomException(ErrorCode.OrderCannotCancelException);
  };
  cancelIPO = async (data, order) => {
    let dataValid = await this.orderValidator.validateCancelIPO(data);
    let userMCSD = await this.userMCSDAccountRepository.findFirst({
      userId: data.userId
    });
    if (userMCSD.length == 0) {
      CustomException(ErrorCode.NotFoundMCSDAccountException);
    }
    if (
      order.status == OrderStatus.STATUS_NEW ||
      order.status == OrderStatus.STATUS_RECEIVE
    ) {
      let params = {
        orderId: order.andIpoOrderId
      };
    }
    CustomException(ErrorCode.OrderCannotCancelException);
  };
  cancelOrder = async data => {
    let order = await this.orderRepository.findOne(data.txnid);
    if (!order) CustomException(ErrorCode.OrderNotFoundException);
    let stockdata = await this.stockService.getStockCode({
      stockcode: order.stockcode
    });

    // data.fee = await this.custFeeService.getFee(data.userId, data.stockcode);
    if (stockdata.stocktypeId == StockTypeConst.PCKG) {
      return await this.cancelPckg(data, order);
    }
    if (stockdata.ipo == 0) return await this.cancelIPO(data, order);
    else return await this.cancelSO(data, stockdata, order);
  };

  collectNew = async (status, ostatus) => {
    let data = {
      status: status,
      ostatus: ostatus,
      stock: {
        stocktypeId: StockTypeConst.SEC
      },
      enddate: {
        gte: new Date()
      }
    };
    //add fullPrefix from MCSD
    let select = {
      stock: {
        select: {
          symbol: true,
          externalid: true
        }
      },
      user: {
        select: {
          UserMCSDAccount: true
        }
      }
    };
    let order = await this.orderRepository.findAll(data, select);
    return order;
  };
}
export default OrderService;
