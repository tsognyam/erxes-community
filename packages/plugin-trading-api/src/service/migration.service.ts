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
import StockWalletValidator from './validator/wallet/stock.wallet.validator';
import UserService from './user/user.service';
import { sendFormsMessage } from '../messageBroker';
import ExportService from './export.service';
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
  private stockWalletValidator: StockWalletValidator;
  private userService: UserService;
  private exportService: ExportService;
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
    this.stockWalletValidator = new StockWalletValidator();
    this.userService = new UserService();
    this.exportService = new ExportService();
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
    } else if (params.body.type == '4') {
      await this.checkBalance(data);
      responseText = 'Balance checked';
    }
    return responseText;
  };
  migrationTransaction = async (data: any) => {
    let sortedData = data.sort(
      (a, b) => (
        new Date(a.createddate).getTime() - new Date(b.createddate).getTime(),
        new Date(a.transaction_date).getTime() -
          new Date(b.transaction_date).getTime()
      )
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
        debitAmount = parseFloat(sortedData[i].debit_amount);
      }
      if (
        !isNaN(sortedData[i].credit_amount) &&
        !isNaN(parseFloat(sortedData[i].credit_amount))
      ) {
        creditAmount = parseFloat(sortedData[i].credit_amount);
      }
      if (sortedData[i].asset_symbol == '9995') {
        let senderWallet: any = undefined,
          receiverWallet: any = undefined,
          transactionAmount = 0,
          transactionType = 0;
        if (debitAmount > 0) {
          receiverWallet = wallets[0];
          transactionAmount = debitAmount;
          transactionType = TransactionConst.TYPE_CHARGE;
        } else if (creditAmount > 0) {
          senderWallet = wallets[0];
          transactionAmount = creditAmount;
          transactionType = TransactionConst.TYPE_WITHDRAW;
        } else continue;
        let transaction = await this.transactionService.createTransactionOrder(
          senderWallet,
          receiverWallet,
          {
            amount: transactionAmount,
            feeAmount: 0,
            type: transactionType,
            description: sortedData[i].description,
            dater: new Date(sortedData[i].transaction_date)
          }
        );
        transaction = await this.transactionService.confirmTransaction({
          orderId: transaction.id,
          confirm: 1
        });
        addedTransaction++;
      } else if (
        sortedData[i].transaction_type == 'Unet tsaasnii guilgee' ||
        sortedData[i].transaction_type == 'Contract note'
      ) {
        let stock = await this.stockRepository.findFirst({
          symbol: sortedData[i].asset_symbol
        });
        if (!stock) continue;
        let senderWallet: any = undefined,
          receiverWallet: any = undefined,
          transactionAmount = 0;
        let senderWalletId: any = undefined,
          receiverWalletId: any = undefined;
        let stockWalletBalance =
          wallets[0].id != undefined
            ? await this.stockWalletValidator.validateBalanceWithWallet({
                walletId: wallets[0].id,
                stockCode: stock.stockcode
              })
            : undefined;
        if (debitAmount > 0) {
          receiverWallet = stockWalletBalance;
          receiverWalletId = wallets[0].id;
          transactionAmount = debitAmount;
        } else if (creditAmount > 0) {
          senderWallet = stockWalletBalance;
          senderWalletId = wallets[0].id;
          transactionAmount = creditAmount;
        } else continue;
        let transaction = await this.stockTransactionService.createTransactionOrder(
          senderWallet,
          receiverWallet,
          {
            senderWalletId: senderWalletId,
            receiverWalletId: receiverWalletId,
            stockCount: transactionAmount,
            stockCode: stock.stockcode,
            type: TransactionConst.TYPE_W2W,
            price: parseFloat(sortedData[i].rate),
            fee: parseFloat(sortedData[i].fee),
            description: sortedData[i].description,
            dater: new Date(sortedData[i].transaction_date)
          }
        );
        transaction = await this.stockTransactionService.confirmTransaction({
          orderId: transaction.id,
          confirm: 1
        });
        addedTransaction++;
      }
    }
    return addedTransaction;
  };
  migrationUserMCSD = async (data: any, subdomain: string) => {
    let userRegisters = data.map((obj: any) => {
      return obj.register_number;
    });

    const users = await this.userService.getUserByRegisterNumber(
      userRegisters,
      subdomain
    );
    let fields = await sendFormsMessage({
      action: 'fields.findOne',
      subdomain: subdomain,
      data: {
        query: {
          code: 'registerNumber'
        }
      },
      isRPC: true,
      defaultValue: []
    });
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
        let registerNumberField = users[i].customFieldsData.find(
          x => x.field == fields._id
        );
        if (!registerNumberField) continue;
        let registerNumber = registerNumberField.value;
        let userData = data.find(x => x.register_number == registerNumber);
        if (!!userData) {
          userMcsdAccount = await this.userMCSDAccountRepository.findUnique({
            prefix: userData.mit_prefix
          });
          if (!!userMcsdAccount) continue;
          let splitSuffix = userData.suffix.split('/');
          if (splitSuffix.length > 1) {
            let userMcsdAccountRequest = {
              userId: users[i]._id,
              registerNumber: userData.register_number,
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
                name: userData.first_name,
                userId: users[i]._id,
                type: WalletConst.TYPE_USER,
                status: WalletConst.STATUS_ACTIVE,
                currencyCode: 'MNT'
              },
              {
                name: userData.first_name,
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
  migrationUserMCSDTest = async (data: any, subdomain: string) => {
    let i = 0;
    //Компанийн бондын шимтгэл
    let feeCorpDebt = await Helper.getValue('FeeCorpDebt');
    //ЗГ бондын шимтгэл
    let feeDebt = await Helper.getValue('FeeDebt');
    //Хувьцааны шимтгэл
    let feeEquity = await Helper.getValue('FeeEquity');
    let addedUserCount = 0;
    for (i = 0; i < data.length; i++) {
      let userMcsdAccount = await this.userMCSDAccountRepository.findUnique({
        userId: data[i].register_number
      });
      if (!!userMcsdAccount == false && !!data[i].register_number) {
        let userData = data[i];
        if (!!userData) {
          userMcsdAccount = await this.userMCSDAccountRepository.findUnique({
            prefix: userData.mit_prefix
          });
          if (!!userMcsdAccount) continue;
          let splitSuffix = userData.suffix.split('/');
          if (splitSuffix.length > 1) {
            let userMcsdAccountRequest = {
              userId: data[i].register_number,
              registerNumber: data[i].register_number,
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
                userId: data[i].register_number,
                stocktypeId: StockTypeConst.SEC,
                value: parseFloat(feeEquity)
              },
              {
                name: 'Компанийн бондын шимтгэл',
                name2: 'Company bond fee',
                userId: data[i].register_number,
                stocktypeId: StockTypeConst.COMPANY_BOND,
                value: parseFloat(feeCorpDebt)
              },
              {
                name: 'ЗГ-ын бондын шимтгэл',
                name2: 'Government bond fee',
                userId: data[i].register_number,
                stocktypeId: StockTypeConst.GOV_BOND,
                value: parseFloat(feeDebt)
              }
            ];
            let wallets = [
              {
                name: data[i].register_number,
                userId: data[i].register_number,
                type: WalletConst.TYPE_USER,
                status: WalletConst.STATUS_ACTIVE,
                currencyCode: 'MNT'
              },
              {
                name: data[i].register_number,
                userId: data[i].register_number,
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
    let dataValid = {
      ...data,
      startdate: data.txndate,
      enddate: !!data.enddate ? data.enddate : data.txndate
    };
    // let nominalWallet = await this.walletService.getNominalWallet({
    //   currencyCode: stockdata.currencyCode
    // });
    data.walletId = wallets[0].id;
    //let dataValid = await this.orderValidator.validateCreateSO(data);
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
  checkBalance = async (data: any) => {
    let i = 0;
    let uncreatedUsers: any = [];
    let uncreatedWalletUsers: any = [];
    let invalidBalances: any = [];
    let uncreatedStocks: any = [];
    for (i = 0; i < data.length; i++) {
      try {
        let userMCSD = await this.userMCSDAccountRepository.findUnique({
          prefix: data[i].mit_prefix
        });
        if (userMCSD) {
          let params: any = {
            userId: userMCSD.userId,
            currencyCode: 'MNT'
          };
          const wallets = await this.walletService.getWalletWithUser(params);
          if (wallets.length == 0) {
            if (
              !uncreatedWalletUsers.some(
                element => element.prefix == userMCSD.prefix
              )
            )
              uncreatedWalletUsers.push({ prefix: userMCSD.prefix });
            continue;
          }
          if (data[i].asset_csd_code == '9995') {
            if (
              parseFloat(data[i].balance) !=
              parseFloat(wallets[0].walletBalance?.balance)
            ) {
              invalidBalances.push({
                prefix: data[i].mit_prefix,
                dbxBalance: data[i].balance,
                tradingBalance: wallets[0].walletBalance?.balance,
                asset_csd_code: data[i].asset_csd_code,
                asset_symbol: data[i].asset_symbol
              });
            }
          } else if (!data[i].asset_csd_code.startsWith('999')) {
            let stock = await this.stockRepository.findFirst({
              symbol: data[i].asset_symbol
            });
            if (!!stock) {
              let stockWalletBalance = await this.stockWalletValidator.validateBalanceWithWallet(
                {
                  walletId: wallets[0].id,
                  stockCode: stock.stockcode
                }
              );
              if (
                parseFloat(data[i].balance) !=
                parseFloat(stockWalletBalance.balance)
              ) {
                invalidBalances.push({
                  prefix: data[i].mit_prefix,
                  dbxBalance: data[i].balance,
                  tradingBalance: stockWalletBalance.balance,
                  asset_csd_code: data[i].asset_csd_code,
                  asset_symbol: data[i].asset_symbol
                });
              }
            } else {
              if (
                !uncreatedStocks.some(
                  element => element.symbol == data[i].asset_symbol
                )
              )
                uncreatedStocks.push({ symbol: data[i].asset_symbol });
            }
          }
        } else {
          if (
            !uncreatedUsers.some(
              element => element.prefix == data[i].mit_prefix
            )
          )
            uncreatedUsers.push({ prefix: data[i].mit_prefix });
        }
      } catch (e) {
        console.log(e);
      }
    }
    await this.exportService.arrayToCsv(uncreatedUsers, 'uncreatedUsers.csv', {
      prefix: 'Prefix'
    });
    await this.exportService.arrayToCsv(
      uncreatedWalletUsers,
      'uncreatedWalletUsers.csv',
      {
        prefix: 'Prefix'
      }
    );
    await this.exportService.arrayToCsv(
      invalidBalances,
      'invalidBalances.csv',
      {
        prefix: 'Prefix',
        dbxBalance: 'DBX_BALANCE',
        tradingBalance: 'TRADING_BALANCE',
        asset_csd_code: 'ASSET_CSD_CODE',
        asset_symbol: 'ASSET_SYMBOL'
      }
    );
    await this.exportService.arrayToCsv(
      uncreatedStocks,
      'uncreatedStocks.csv',
      {
        symbol: 'Symbol'
      }
    );
  };
}
