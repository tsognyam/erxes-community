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
import { sendMITMessage } from '../messageBroker';
import StockValidator from './validator/stock.validator';
import NotificationService from './notification.service';
import WalletRepository from '../repository/wallet/wallet.repository';
import { graphqlPubsub } from '../configs';
import * as moment from 'moment';
let MIT_BEGINTIME = process.env.MIT_BEGINTIME || '';
let MIT_ENDTIME = process.env.MIT_ENDTIME || '';
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
  private stockValidator: StockValidator;
  private notificationService: NotificationService;
  private walletRepository: WalletRepository;

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
    this.stockValidator = new StockValidator();
    this.notificationService = new NotificationService();
    this.walletRepository = new WalletRepository();
  }
  get = async data => {
    var order = await this.orderValidator.validateGet(data);
    return order;
  };
  getSummary = async data => {
    let order = await this.orderValidator.validateGetSummary(data);
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
      let now = moment().format('HH:mm');
      if (live && MIT_BEGINTIME <= now && now <= MIT_ENDTIME) {
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
        if (order.cnt < 5)
          await sendMITMessage({
            subdomain: 'localhost',
            action: 'send',
            data: edata
          });
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
    if (!order) CustomException(ErrorCode.OrderNotFoundException);
    let stockdata = await this.stockService.getStockCode({
      stockcode: order.stockcode
    });
    // data.status = '0';
    data.userId = order.userId;
    data.fee = await this.custFeeService.getFee(order.userId, order.stockcode);
    data.ordertype = order.ordertype;
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
    let now = moment().format('HH:mm');
    if (MIT_BEGINTIME <= now && now <= MIT_ENDTIME) {
      await sendMITMessage({
        subdomain: 'localhost',
        action: 'send',
        data: edata
      });
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
      let now = moment().format('HH:mm');
      if (MIT_BEGINTIME <= now && now <= MIT_ENDTIME) {
        await sendMITMessage({
          subdomain: 'localhost',
          action: 'send',
          data: edata
        });
      }
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

  receive = async received => {
    let order = await this.orderRepository.findOne(
      parseInt(received.data.orderid)
    );
    if (received.type == '8') {
      if (received.data.status == 0) {
        order.status = OrderStatus.STATUS_RECEIVE;
        order.ostatus = OrderStatus.STATUS_NEW;
        order.descr = 'Хүлээн авсан';
        order.descr2 = 'Received';
        order.mseExecutionId = received.data.mseexecutionid;
        order.mseOrderId = received.data.mseorderid;
        order.mseTradeId = received.data.msetradeid;
        let uorder = await this.orderRepository.update(order);
      }
      if (received.data.status == 1) {
        //edit

        let morder = order;
        morder.status = OrderStatus.STATUS_RECEIVE;
        morder.ostatus = OrderStatus.STATUS_NEW;
        morder.descr = 'Хүлээн авсан';
        morder.descr2 = 'Received';
        morder.cnt = parseInt(received.data.leavesQty);
        await this.orderRepository.update(morder);

        let calcPrice = parseFloat(received.data.doneprice);
        let stockdata = await this.stockValidator.validateGetStockCode({
          stockcode: order.stockcode
        });
        if (morder.txntype == OrderTxnType.Buy) {
          let camount;
          if (stockdata.stocktypeId == StockTypeConst.COMPANY_BOND) {
            let bondPrice = await this.stockService.calculateBond({
              stockcode: order.stockcode,
              price: parseFloat(received.data.doneprice),
              cnt: parseInt(received.data.donecnt),
              orderEndDate: new Date(),
              userId: order.userId
            });
            calcPrice = bondPrice.dirtyPrice;
            camount = bondPrice.netAmount;
          } else {
            camount = calcPrice * parseInt(received.data.donecnt);
          }
          let feeamount = camount * (order.fee / 100);
          let tranparam = {
            orderId: morder.tranOrderId,
            amount: parseFloat(camount.toFixed(4)),
            feeAmount: parseFloat(feeamount.toFixed(4))
          };
          let newtran = await this.transactionService.participateTransaction(
            tranparam
          );
          //update transaction order
          order.tranOrderId = newtran.id;
          let nominalWallet = await this.walletService.getNominalWallet({
            currencyCode: stockdata.currencyCode
          });
          let stockOrder = await this.stockTransactionService.w2w({
            senderWalletId: nominalWallet.id,
            receiverWalletId: order.walletId,
            stockCount: parseInt(received.data.donecnt),
            stockCode: order.stockcode
          });
          order.stockOrderId = stockOrder.id;
        } else {
          let tranparam = {
            orderId: morder.stockOrderId,
            stockCount: parseInt(received.data.donecnt)
          };
          let newtran = await this.stockTransactionService.participateTransaction(
            tranparam
          );

          //update transaction order
          order.stockOrderId = newtran.id;
        }
        order.status = OrderStatus.STATUS_PARTIALLY_FILLED;
        order.descr = 'Хэсэгчилэн биелсэн';
        order.descr2 = 'Partially filled';
        order.donedate = new Date();
        order.cnt = parseInt(received.data.donecnt);
        order.doneprice = calcPrice;
        order.originalDonePrice = parseFloat(received.data.doneprice);
        order.donecnt = parseInt(received.data.donecnt);

        order.mseExecutionId = received.data.mseexecutionid;
        order.mseOrderId = received.data.mseorderid;
        order.mseTradeId = received.data.msetradeid;
        order.regdate = new Date();
        order.txnid = undefined;

        let iorder = await this.orderRepository.create(order);
        await this.stockTransactionService.confirmTransaction({
          orderId: order.stockOrderId,
          confirm: TransactionConst.STATUS_SUCCESS
        });

        let stockNotification = await this.stockValidator.checkStock(
          order.stockcode
        );
        let userWallet = await this.walletRepository.findUserByWalletId(
          order.walletId
        );
        // let params = {
        //   key: "orderFilled",
        //   uuid: userWallet.user.uuid,
        //   subject: "Захиалга",
        //   type: "success",
        //   content: "Таны захиалга өгсөн " + stockNotification.symbol + ", " + order.donecnt + " ширхэг үнэт цаас амжилттай биелэгдлээ.",
        //   data: order
        // }
        // this.notificationService.send(params);
      }
      if (received.data.status == 2) {
        order.status = OrderStatus.STATUS_CALCULATED;
        order.mseExecutionId = received.data.mseexecutionid;
        order.mseOrderId = received.data.mseorderid;
        order.mseTradeId = received.data.msetradeid;
        await this.orderRepository.update(order);

        let tranParams = {
          orderId: parseInt(order.txnid),
          donecnt: parseInt(received.data.donecnt),
          doneprice: parseFloat(received.data.doneprice),
          donedate: new Date()
        };
        order = await this.transactionService.reCreateTransaction(tranParams);
        //push notification
        let stockNotification = await this.stockValidator.checkStock(
          order.stockcode
        );
        let userWallet = await this.walletRepository.findUserByWalletId(
          order.walletId
        );
        // let params = {
        //   key: "orderFilled",
        //   uuid: userWallet.user.uuid,
        //   subject: "Захиалга",
        //   type: "success",
        //   content: "Таны захиалга өгсөн " + stockNotification.symbol + ", " + order.donecnt + " ширхэг үнэт цаас амжилттай биелэгдлээ.",
        //   data: order
        // }
        // this.notificationService.send(params);
      }
      if (received.data.status == 4) {
        order.descr = 'Цуцлагдсан';
        order.descr2 = 'Cancelled';
        order.status = OrderStatus.STATUS_CANCEL;
        order.updatedate = new Date();
        order.updateUserId = order.oupdateUserId;
        let uorder = await this.orderRepository.update(order);

        if (order.txntype == OrderTxnType.Buy) {
          let params = {
            orderId: order.tranOrderId,
            confirm: 0
          };
          const canceltran = await this.transactionService.confirmTransaction(
            params
          );
        } else {
          let params = {
            orderId: order.stockOrderId,
            confirm: 0
          };
          const canceltran = await this.stockTransactionService.confirmTransaction(
            params
          );
        }
        let stockNotification = await this.stockValidator.checkStock(
          order.stockcode
        );
        let userWallet = await this.walletRepository.findUserByWalletId(
          order.walletId
        );
        // let params = {
        //   key: "orderCancelled",
        //   uuid: userWallet.user.uuid,
        //   subject: "Захиалга",
        //   type: "info",
        //   content: "Таны захиалга өгсөн " + stockNotification.symbol + ", " + order.cnt + " ширхэг үнэт цаас цуцлагдлаа.",
        //   data: order
        // }
        // this.notificationService.send(params);
      }
      if (received.data.status == 8 || received.data.status == 9) {
        order.descr = 'Түтгэлзсэн - ' + received.data.description;
        order.descr2 = 'Rejected - ' + received.data.description;
        order.status = OrderStatus.STATUS_REJECTED;
        order.updatedate = new Date();
        order.updateUserId = order.oupdateUserId;
        let uorder = await this.orderRepository.update(order);

        if (order.txntype == OrderTxnType.Buy) {
          let params = {
            orderId: order.tranOrderId,
            confirm: 0
          };
          const canceltran = await this.transactionService.confirmTransaction(
            params
          );
        } else {
          let params = {
            orderId: order.stockOrderId,
            confirm: 0
          };
          const canceltran = await this.stockTransactionService.confirmTransaction(
            params
          );
        }
        let stockNotification = await this.stockValidator.checkStock(
          order.stockcode
        );
        let userWallet = await this.walletRepository.findUserByWalletId(
          order.walletId
        );
        // let params = {
        //   key: "orderRejected",
        //   uuid: userWallet.user.uuid,
        //   subject: "Захиалга",
        //   type: "warning",
        //   content: "Таны захиалга өгсөн " + stockNotification.symbol + ", " + order.cnt + " ширхэг үнэт цаас цуцлагдлаа.",
        //   data: order
        // }
        // this.notificationService.send(params);
      }
      if (received.data.status == 'C') {
        order.descr = 'Хүчинтэй хугацаа дууссан';
        order.descr2 = 'Expired';
        order.status = OrderStatus.STATUS_EXPIRED;
        order.updatedate = new Date();
        order.updateUserId = order.oupdateUserId;
        let uorder = await this.orderRepository.update(order);

        if (order.txntype == OrderTxnType.Buy) {
          let params = {
            orderId: order.tranOrderId,
            confirm: 0
          };
          const canceltran = await this.transactionService.confirmTransaction(
            params
          );
        } else {
          let params = {
            orderId: order.stockOrderId,
            confirm: 0
          };
          const canceltran = await this.stockTransactionService.confirmTransaction(
            params
          );
        }
        let stockNotification = await this.stockValidator.checkStock(
          order.stockcode
        );
        let userWallet = await this.walletRepository.findUserByWalletId(
          order.walletId
        );
        // let params = {
        //   key: "orderExpired",
        //   uuid: userWallet.user.uuid,
        //   subject: "Захиалга",
        //   type: "warning",
        //   content: "Таны захиалга өгсөн " + stockNotification.symbol + ", " + order.cnt + " ширхэг үнэт цаасны хүчинтэй хугацаа дуусан цуцлагдлаа.",
        //   data: order
        // }
        // this.notificationService.send(params);
      }
    }

    if (received.type == '9') {
      //update order
      if (received.data.status == 8 || received.data.status == 9) {
        order.descr = 'Түтгэлзсэн - ' + received.data.description;
        order.descr2 = 'Rejected - ' + received.data.description;
        order.status = OrderStatus.STATUS_REJECTED;
        order.updatedate = new Date();
        order.updateUserId = order.oupdateUserId;
        let uorder = await this.orderRepository.update(order);

        if (order.txntype == OrderTxnType.Buy) {
          let params = {
            orderId: order.tranOrderId,
            confirm: 0
          };
          const canceltran = await this.transactionService.confirmTransaction(
            params
          );
        } else {
          let params = {
            orderId: order.stockOrderId,
            confirm: 0
          };
          const canceltran = await this.stockTransactionService.confirmTransaction(
            params
          );
        }
      }
      if (received.data.status == 'C') {
        order.descr = 'Хүчинтэй хугацаа дууссан';
        order.descr2 = 'Expired';
        order.status = OrderStatus.STATUS_EXPIRED;
        order.updatedate = new Date();
        order.updateUserId = order.oupdateUserId;
        let uorder = await this.orderRepository.update(order);

        if (order.txntype == OrderTxnType.Buy) {
          let params = {
            orderId: order.tranOrderId,
            confirm: 0
          };
          const canceltran = await this.transactionService.confirmTransaction(
            params
          );
        } else {
          let params = {
            orderId: order.stockOrderId,
            confirm: 0
          };
          const canceltran = await this.stockTransactionService.confirmTransaction(
            params
          );
        }
      }
      let stockNotification = await this.stockValidator.checkStock(
        order.stockcode
      );
      let userWallet = await this.walletRepository.findUserByWalletId(
        order.walletId
      );
      // let params = {
      //   key: "orderRejected",
      //   uuid: userWallet.user.uuid,
      //   type: "warning",
      //   subject: "Захиалга",
      //   content: "Таны захиалга өгсөн " + stockNotification.symbol + ", " + order.cnt + " ширхэг үнэт цаас цуцлагдлаа.",
      //   data: order
      // }
      // this.notificationService.send(params);
    }
    graphqlPubsub.publish('orderReceived', {
      orderReceived: order
    });

    // let userId = order.userId;
    // const ws = this._webSocket.getClients().get(userId);
    // if (ws)
    //   ws.emit('data', JSON.stringify(order));
  };
  collect = async () => {
    //new order
    let order = await this.collectNew(
      OrderStatus.STATUS_NEW,
      OrderStatus.STATUS_NEW
    );

    for (let i = 0; i < order.values.length; i++) {
      let orderRow = order.values[i];
      let edata = {
        otype: '1',
        fullPrefix: orderRow.user.UserMCSDAccount[0].fullPrefix,
        orderid: orderRow.txnid.toString(),
        symbol: orderRow.stock.externalid,
        type: orderRow.ordertype.toString(),
        side: orderRow.txntype.toString(),
        tif: orderRow.condid.toString(),
        price: orderRow.price.toString(),
        quantity: orderRow.cnt.toString(),
        expiredate: Helper.dateToString(orderRow.enddate)
      };
      await sendMITMessage({
        subdomain: 'localhost',
        action: 'send',
        data: edata
      });
    }
    //update order
    let uorder = await this.collectNew(
      OrderStatus.STATUS_RECEIVE,
      OrderStatus.STATUS_UPDATE
    );
    uorder.values.forEach(async order => {
      let edata = {
        otype: '2',
        fullPrefix: order.user.UserMCSDAccount[0].fullPrefix,
        orderid: order.txnid.toString(),
        symbol: order.stock.externalid,
        type: order.ordertype.toString(),
        side: order.txntype.toString(),
        tif: order.condid.toString(),
        price: order.price.toString(),
        quantity: order.cnt.toString(),
        expiredate: Helper.dateToString(order.enddate),
        ordersubid: order.mseOrderId.toString()
      };
      await sendMITMessage({
        subdomain: 'localhost',
        action: 'send',
        data: edata
      });
    });
    //cancel order
    let corder = await this.collectNew(
      OrderStatus.STATUS_RECEIVE,
      OrderStatus.STATUS_CANCEL
    );
    corder.values.forEach(async order => {
      let edata = {
        otype: '3',
        fullPrefix: order.user.UserMCSDAccount[0].fullPrefix,
        orderid: order.txnid.toString(),
        side: order.txntype.toString(),
        symbol: order.stock.externalid,
        ordersubid: order.mseOrderId.toString()
      };
      await sendMITMessage({
        subdomain: 'localhost',
        action: 'send',
        data: edata
      });
    });
  };
}
export default OrderService;
