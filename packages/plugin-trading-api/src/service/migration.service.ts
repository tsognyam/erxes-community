import * as csv from 'csv-parser';
import * as fs from 'fs';
import OrderService from './order.service';
import StockRepository from '../repository/stock.repository';
import UserMCSDAccountRepository from '../repository/user/user.mcsd.repository';
import {
  OrderTxnType,
  TxnSourceConst,
  OrderType,
  OrderCondition,
  OrderStatus
} from '../constants/stock';
import OrderValidator from './validator/order.validator';
import OrderRepository from '../repository/order.repository';
import WalletService from './wallet/wallet.service';
import StockService from './stock.service';
import { ErrorCode, CustomException } from '../exception/error-code';
import { TransactionConst } from '../constants/wallet';
import TransactionService from './wallet/transaction.service';
import StockTransactionService from './wallet/stock.transaction.service';
import { getSubdomain } from '@erxes/api-utils/src/core';
export default class MigrationService {
  private orderService: OrderService;
  private stockRepository: StockRepository;
  private userMCSDAccountRepository: UserMCSDAccountRepository;
  private orderValidator: OrderValidator;
  private orderRepository: OrderRepository;
  private walletService: WalletService;
  private stockService: StockService;
  private transactionService: TransactionService;
  private stockTransactionService: StockTransactionService;
  constructor() {
    this.orderService = new OrderService();
    this.stockRepository = new StockRepository();
    this.userMCSDAccountRepository = new UserMCSDAccountRepository();
    this.orderValidator = new OrderValidator();
    this.orderRepository = new OrderRepository();
    this.walletService = new WalletService();
    this.stockService = new StockService();
    this.transactionService = new TransactionService();
    this.stockTransactionService = new StockTransactionService();
  }
  getCsvData = async fileName => {
    return new Promise(function(resolve, reject) {
      var fetchData: any = [];
      fs.createReadStream('./data/uploads/migration/' + fileName)
        .pipe(csv({ separator: ',' }))
        .on('data', row => {
          fetchData.push(row);
        })
        .on('end', () => {
          resolve(fetchData);
        })
        .on('error', reject);
    });
  };
  migration = async params => {
    let count = 0,
      responseText = '';
    const subdomain = getSubdomain(params.req);
    console.log(subdomain);
    let data: any = await this.getCsvData(params.file.filename);
    if (params.body.type == '1') {
      count = await this.migrationUserMCSD(data);
      responseText = '';
    } else if (params.body.type == '2') {
      let sortedOrderData = data.sort(
        (a, b) =>
          new Date(a.createddate).getTime() - new Date(b.createddate).getTime()
      );
      count = await this.migrationOrder(sortedOrderData);
      responseText =
        'Биелсэн төлөвтэй нийт ' + count + ' захиалга амжилттай импорт хийлээ';
    } else if (params.body.type == '3') {
      count = await this.migrationTransaction(data);
    }
    return responseText;
  };
  migrationTransaction = async data => {
    return 0;
  };
  migrationUserMCSD = async data => {
    return 0;
  };
  migrationOrder = async data => {
    let i = 0,
      addedOrder = 0;
    for (i = 0; i < data.length; i++) {
      if (data[i].statusname != 'Биелсэн') continue;
      let stock = await this.stockRepository.findFirst({
        symbol: data[i].symbol
      });
      if (!stock) continue;
      let userMCSD = await this.userMCSDAccountRepository.findFirst({
        prefix: data[i].mit_prefix
      });
      if (!userMCSD) continue;
      let orderExtraParams: any = {
        condid:
          data[i].timeinforce == 'GTC'
            ? OrderCondition.GTC
            : data[i].timeinforce == 'Day'
            ? OrderCondition.Day
            : OrderCondition.GTD
      };
      if (orderExtraParams.condid == OrderCondition.GTD)
        orderExtraParams.enddate = new Date(data[i].timeinforce);
      let orderParams = {
        stockcode: stock.stockcode,
        userId: userMCSD.userId,
        txntype:
          data[i].buysell == 'buy' ? OrderTxnType.Buy : OrderTxnType.Sell,
        ordertype: OrderType.LIMIT,
        cnt: parseFloat(data[i].cumquantity),
        price: parseFloat(data[i].price),
        txndate: new Date(data[i].createddate),
        txnsource: TxnSourceConst.Broker,
        orderno: data[i].order_id,
        ...orderExtraParams
      };
      let feeamt = parseFloat(data[i].feeamt);
      let fee = (feeamt / (parseFloat(data[i].totalamt) - feeamt)) * 100;
      if (!!fee) {
        await this.createMigrationOrder(orderParams, fee);
        addedOrder++;
      }
    }
    return addedOrder;
  };
  createTransaction = async data => {};
  createMigrationOrder = async (data, fee) => {
    let stockdata = await this.stockService.getStockCode({
      stockcode: data.stockcode
    });
    data.ipo = stockdata.ipo;
    data.status = OrderStatus.STATUS_NEW;
    data.fee = fee;
    let params: any = {
      userId: data.userId,
      currencyCode: stockdata.currencyCode
    };
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
    // if (dataValid.txntype == OrderTxnType.Buy) {
    //   let camount = dataValid.price * dataValid.cnt;
    //   let feeamount = camount * (dataValid.fee / 100);
    //   params = {
    //     senderWalletId: wallets[0].id,
    //     receiverWalletId: nominalWallet.id,
    //     type: TransactionConst.TYPE_W2W,
    //     amount: camount,
    //     feeAmount: feeamount
    //   };
    //   const transaction = await this.transactionService.w2w(params);
    //   dataValid.tranOrderId = transaction.id;
    // } else {
    //   params = {
    //     senderWalletId: wallets[0].id,
    //     receiverWalletId: nominalWallet.id,
    //     stockCount: data.cnt,
    //     stockCode: stockdata.stockcode
    //   };
    //   const transaction = await this.stockTransactionService.w2w(params);
    //   dataValid.stockOrderId = transaction.id;
    // }
    dataValid.originalCnt = dataValid.cnt;
    dataValid.descr = 'Шинэ';
    dataValid.descr2 = 'New';
    let order = await this.orderRepository.create(dataValid);
    order.orderno = order.txnid.toString();
    order.donecnt = order.cnt;
    order.doneprice = order.price;
    order.donedate = order.txndate;
    order.descr = 'Биелсэн';
    order.descr2 = 'Filled';
    order.status = OrderStatus.STATUS_FILLED;
    await this.orderRepository.update(order);
  };
}
