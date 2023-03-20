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
  OrderStatus,
  StockTypeConst
} from '../constants/stock';
import OrderValidator from './validator/order.validator';
import OrderRepository from '../repository/order.repository';
import WalletService from './wallet/wallet.service';
import StockService from './stock.service';
import { ErrorCode, CustomException } from '../exception/error-code';
import { TransactionConst, WalletConst } from '../constants/wallet';
import TransactionService from './wallet/transaction.service';
import StockTransactionService from './wallet/stock.transaction.service';
import { getSubdomain } from '@erxes/api-utils/src/core';
import { getUsers } from '../models/utils';
import CustFeeService from './custfee.service';
import Helper from '../middleware/helper.service';
import BaseRepository from '../repository/base.repository';
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
  private custFeeService: CustFeeService;
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
    this.custFeeService = new CustFeeService();
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
    let data: any = await this.getCsvData(params.file.filename);
    if (params.body.type == '1') {
      const subdomain = getSubdomain(params);
      count = await this.migrationUserMCSD(data, subdomain);
      responseText = 'Нийт ' + count + ' харилцагч амжилттай импорт хийлээ';
    } else if (params.body.type == '2') {
      count = await this.migrationOrder(data);
      responseText =
        'Биелсэн төлөвтэй нийт ' + count + ' захиалга амжилттай импорт хийлээ';
    } else if (params.body.type == '3') {
      count = await this.migrationTransaction(data);
      responseText =
        'Орлого зарлагын нийт ' + count + ' гүйлгээ амжилттай импорт хийлээ';
    }
    return responseText;
  };
  migrationTransaction = async (data: any) => {
    let sortedData = data.sort(
      (a, b) =>
        new Date(a.createddate).getTime() - new Date(b.createddate).getTime()
    );
    let i = 0,
      addedTransaction = 0;
    let nominalWallet = await this.walletService.getNominalWallet({
      currencyCode: 'MNT'
    });
    for (i = 0; i < sortedData.length; i++) {
      let userMCSD = await this.userMCSDAccountRepository.findUnique({
        prefix: sortedData[i].mit_prefix
      });
      if (!userMCSD) continue;
      let params: any = {
        userId: userMCSD.userId,
        currencyCode: 'MNT'
      };
      const wallets = await this.walletService.getWalletWithUser(params);
      if (wallets.length == 0) {
        CustomException(ErrorCode.WalletNotFoundException);
      }
      let debitAmount = 0,
        creditAmount = 0;
      if (
        !isNaN(sortedData[i].debit_amount) &&
        !isNaN(parseFloat(sortedData[i].debit_amount))
      ) {
        debitAmount = sortedData[i].debit_amount;
      }
      if (
        !isNaN(sortedData[i].credit_amount) &&
        !isNaN(parseFloat(sortedData[i].credit_amount))
      ) {
        creditAmount = sortedData[i].credit_amount;
      }
      if (sortedData[i].asset_symbol == '9995') {
        if (debitAmount > 0) {
          let transaction = await this.transactionService.createTransactionOrder(
            undefined,
            wallets[0],
            {
              amount: debitAmount,
              feeAmount: 0,
              type: TransactionConst.TYPE_CHARGE,
              description: sortedData.description,
              dater: new Date(sortedData[i].transaction_date)
            }
          );
          transaction = await this.transactionService.confirmTransaction({
            orderId: transaction.id,
            confirm: 1
          });
          addedTransaction++;
        } else if (creditAmount > 0) {
          let transaction = await this.transactionService.w2w({
            senderWalletId: wallets[0].id,
            receiverWalletId: undefined,
            amount: creditAmount,
            feeAmount: 0,
            type: TransactionConst.TYPE_WITHDRAW,
            description: data.description,
            dater: new Date(sortedData[i].transaction_date)
          });
          transaction = await this.transactionService.confirmTransaction({
            orderId: transaction.id,
            confirm: 1
          });
          addedTransaction++;
        } else continue;
      }
      if (sortedData[i].transaction_type == 'Unet tsaasnii guilgee') {
        let stock = await this.stockRepository.findFirst({
          symbol: sortedData[i].asset_csd_code
        });
        if (!stock) continue;
        if (debitAmount > 0) {
          let transaction = await this.stockTransactionService.w2w({
            senderWalletId: wallets[0].id,
            receiverWalletId: nominalWallet.id,
            stockCount: debitAmount,
            stockCode: stock.stockcode
          });
          transaction = await this.stockTransactionService.confirmTransaction({
            orderId: transaction.id,
            confirm: 1
          });
        } else if (creditAmount > 0) {
          let transaction = await this.stockTransactionService.w2w({
            senderWalletId: nominalWallet.id,
            receiverWalletId: wallets[i].id,
            stockCount: debitAmount,
            stockCode: stock.stockcode
          });
          transaction = await this.stockTransactionService.confirmTransaction({
            orderId: transaction.id,
            confirm: 1
          });
        }
      }
    }
    return addedTransaction;
  };
  migrationUserMCSD = async (data: any, subdomain: string) => {
    let userRegisters = data.map((obj: any) => {
      return obj.register_number;
    });
    let uniqRegisters = [...new Set(userRegisters)];
    let query = {
      'customFieldsDataByFieldCode.registerNumber.value': {
        $in: uniqRegisters
      }
    };
    const users = await getUsers(query, subdomain);
    let i = 0;
    //Компанийн бондын шимтгэл
    let feeCorpDebt = await Helper.getValue('FeeCorpDebt');
    //ЗГ бондын шимтгэл
    let feeDebt = await Helper.getValue('FeeDebt');
    //Хувьцааны шимтгэл
    let feeEquity = await Helper.getValue('FeeEquity');
    let addedUserCount = 0;
    for (i = 0; i < users.length; i++) {
      let userMcsdAccount = await this.userMCSDAccountRepository.findUnique({
        userId: users[i]._id
      });
      if (!!userMcsdAccount == false) {
        let registerNumber =
          users[i].customFieldsDataByFieldCode?.registerNumber?.value;
        let userData = data.find(x => x.register_number == registerNumber);
        if (!!userData) {
          let splitSuffix = userData.suffix.split('/');
          if (splitSuffix.length > 1) {
            let userMcsdAccountRequest = {
              userId: users[i]._id,
              prefix: userData.mit_prefix,
              clientSuffix: splitSuffix[1].slice(-2),
              bdcAccountId:
                '00' +
                userData.broker_code +
                userData.account_number.padStart(8, '0'),
              fullPrefix: userData.suffix,
              createdAt: new Date(),
              description: 'Импорт хийсэн',
              status: 1
            };
            if (
              !isNaN(userData.stock_fee) &&
              !isNaN(parseFloat(userData.stock_fee))
            ) {
              feeEquity = userData.stock_fee;
            }
            if (
              !isNaN(userData.bond_fee) &&
              !isNaN(parseFloat(userData.bond_fee))
            ) {
              feeCorpDebt = userData.bond_fee;
            }
            let custfees = [
              {
                name: 'Хувьцааны шимтгэл',
                name2: 'Securities fee',
                userId: users[i]._id,
                stocktypeId: StockTypeConst.SEC,
                value: parseFloat(feeEquity)
              },
              {
                name: 'Компанийн бондын шимтгэл',
                name2: 'Company bond fee',
                userId: users[i]._id,
                stocktypeId: StockTypeConst.COMPANY_BOND,
                value: parseFloat(feeCorpDebt)
              },
              {
                name: 'ЗГ-ын бондын шимтгэл',
                name2: 'Government bond fee',
                userId: users[i]._id,
                stocktypeId: StockTypeConst.GOV_BOND,
                value: parseFloat(feeDebt)
              }
            ];
            let wallets = [
              {
                name: users[i].firstName,
                userId: users[i]._id,
                type: WalletConst.TYPE_USER,
                status: WalletConst.STATUS_ACTIVE,
                currencyCode: 'MNT'
              },
              {
                name: users[i].firstName,
                userId: users[i]._id,
                type: WalletConst.TYPE_USER,
                status: WalletConst.STATUS_ACTIVE,
                currencyCode: 'USD'
              }
            ];
            await this.userMCSDAccountRepository.create(userMcsdAccountRequest);
            let j = 0;
            for (j = 0; j < custfees.length; j++) {
              await this.custFeeService.create(custfees[j]);
            }
            await this.walletService.createWallet(wallets[0], subdomain);
            await this.walletService.createWallet(wallets[1], subdomain);
            addedUserCount++;
          } else continue;
        }
      }
    }
    return addedUserCount;
  };
  migrationOrder = async data => {
    let i = 0,
      addedOrder = 0;
    let sortedData = data.sort(
      (a, b) =>
        new Date(a.createddate).getTime() - new Date(b.createddate).getTime()
    );
    for (i = 0; i < sortedData.length; i++) {
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
