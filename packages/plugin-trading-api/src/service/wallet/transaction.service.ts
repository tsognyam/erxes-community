import { TransactionValidator } from '../validator/wallet/transaction.validator';
import {
  SettlementConst,
  TransactionConst,
  WalletConst
} from '../../constants/wallet';
import TransactionRepository from '../../repository/wallet/transaction.repository';
import SettlementMCSDRepository from '../../repository/wallet/settlement.mcsd.repository';
import TransactionOrderRepository from '../../repository/wallet/transaction.order.repository';
import WalletRepository from '../../repository/wallet/wallet.repository';
import { Transaction } from '@prisma/client';
import WalletValidator from '../validator/wallet/wallet.validator';
import { CustomException, ErrorCode } from '../../exception/error-code';
import OrderRepository from '../../repository/order.repository';
import StockService from '../stock.service';
import {
  StockTypeConst,
  OrderTxnType,
  StockConst,
  OrderStatus
} from '../../constants/stock';
import WalletService from './wallet.service';
import StockTransactionService from './stock.transaction.service';
import * as moment from 'moment';
import StockOrderRepository from '../../repository/wallet/stock.transaction.order.repository';
class TransactionService {
  private transactionValidator: TransactionValidator;
  private transactionRepository: TransactionRepository;
  private settlementRepository: SettlementMCSDRepository;
  private transactionOrderRepository: TransactionOrderRepository;
  private walletRepository: WalletRepository;
  private walletValidator: WalletValidator;
  private orderRepository: OrderRepository;
  private stockService: StockService;
  private walletService: WalletService;
  private stockTransactionService: StockTransactionService;
  private stockOrderRepository: StockOrderRepository;
  constructor() {
    this.transactionValidator = new TransactionValidator();
    this.walletValidator = new WalletValidator();
    this.transactionRepository = new TransactionRepository();
    this.settlementRepository = new SettlementMCSDRepository();
    this.transactionOrderRepository = new TransactionOrderRepository();
    this.walletRepository = new WalletRepository();
    this.orderRepository = new OrderRepository();
    this.stockService = new StockService();
    this.walletService = new WalletService();
    this.stockTransactionService = new StockTransactionService();
    this.stockOrderRepository = new StockOrderRepository();
  }
  w2w = async (params: any) => {
    var {
      senderWallet,
      receiverWallet,
      data
    } = await this.transactionValidator.validateW2W(params);
    return await this.createTransactionOrder(
      senderWallet,
      receiverWallet,
      data
    );
  };
  reCreateTransaction = async params => {
    var data = await this.transactionValidator.validateReCreateTransaction(
      params
    );
    let order = await this.orderRepository.findOne(data.orderId);
    let receiverWalletId = undefined;
    let stockdata = await this.stockService.getStockCode({
      stockcode: order.stockcode
    });
    if (order == undefined) CustomException(ErrorCode.OrderNotFoundException);
    if (
      order.donecnt == null &&
      order.doneprice == null &&
      order.donedate == null
    ) {
      order.originalDonePrice = data.doneprice;

      if (stockdata.stocktypeId == StockTypeConst.COMPANY_BOND) {
        let bondPrice = await this.stockService.calculateBond({
          stockcode: order.stockcode,
          price: parseFloat(data.doneprice),
          cnt: parseInt(data.donecnt),
          orderEndDate: new Date(),
          userId: order.userId
        });

        data.doneprice = bondPrice.dirtyPrice;
      }

      order.donecnt = data.donecnt;
      order.doneprice = data.doneprice;
      order.donedate = data.donedate;
    }
    let nominalWallet = await this.walletService.getNominalWallet({
      currencyCode: stockdata.currencyCode
    });
    if (order.txntype == OrderTxnType.Buy) {
      if (order.ipo != StockConst.IPO) {
        let transactionOrder = await this.transactionOrderRepository.findById(
          order.tranOrderId
        );
        if (
          transactionOrder.amount.toFixed(4) !=
          (order.doneprice * order.donecnt).toFixed(4)
        ) {
          //recreate transaction
          let camount = parseFloat(order.doneprice) * parseInt(order.donecnt);
          let feeamount = camount * (order.fee / 100);
          let tranparam = {
            orderId: order.tranOrderId,
            amount: parseFloat(camount.toFixed(4)),
            feeAmount: parseFloat(feeamount.toFixed(4))
          };
          let oldTransactionOrder = order.tranOrderId;
          let newTransactionOrder = await this.participateTransaction(
            tranparam
          );
          order.tranOrderId = newTransactionOrder.id;
          receiverWalletId = newTransactionOrder.walletIdFrom;
          let params = {
            orderId: oldTransactionOrder,
            confirm: 0
          };
          await this.confirmTransaction(params);
        } else {
          receiverWalletId = transactionOrder.walletIdFrom;
        }
      } else {
        receiverWalletId = order.walletId;
      }
      if (order.stockOrderId == null || order.stockOrderId == undefined) {
        let stockOrder = await this.stockTransactionService.w2w({
          senderWalletId: nominalWallet.id,
          receiverWalletId: receiverWalletId,
          stockCount: order.donecnt,
          stockCode: order.stockcode
        });
        order.stockOrderId = stockOrder.id;
      }
    } else if (
      order.txntype == OrderTxnType.Sell &&
      order.ipo != StockConst.IPO
    ) {
      let stockOrder = await this.stockOrderRepository.findById(
        order.stockOrderId
      );
      if (stockOrder.stockCount != order.donecnt) {
        let stockTransactionParams = {
          orderId: order.stockOrderId,
          stockCount: order.donecnt
        };
        let oldStockOrder = order.stockOrderId;
        let newStockOrder = await this.stockTransactionService.participateTransaction(
          stockTransactionParams
        );
        order.stockOrderId = newStockOrder.id;
        receiverWalletId = newStockOrder.walletIdFrom;
        let params = {
          orderId: oldStockOrder,
          confirm: 0
        };
        await this.stockTransactionService.confirmTransaction(params);
      } else {
        receiverWalletId = stockOrder.walletIdFrom;
      }
      if (order.tranOrderId == null || order.tranOrderId == undefined) {
        let camount = parseFloat(order.doneprice) * parseInt(order.donecnt);
        let feeamount = camount * (order.fee / 100);
        let tranOrder = await this.w2w({
          senderWalletId: nominalWallet.id,
          receiverWalletId: stockOrder.walletIdFrom,
          amount: parseFloat(camount.toFixed(4)),
          feeAmount: parseFloat(feeamount.toFixed(4)),
          feeType: TransactionConst.FEE_TYPE_RECEIVER,
          type: TransactionConst.TYPE_W2W
        });
        order.tranOrderId = tranOrder.id;
      }
    }
    order.descr = 'Биелсэн';
    order.descr2 = 'Filled';
    order.status = OrderStatus.STATUS_FILLED;
    order.updatedate = new Date();
    console.log('order', order);
    order = await this.orderRepository.update(order);
    await this.stockTransactionService.confirmTransaction({
      orderId: order.stockOrderId,
      confirm: TransactionConst.STATUS_SUCCESS
    });
    if (
      stockdata.stocktypeId == StockTypeConst.PCKG ||
      stockdata.stocktypeId == StockTypeConst.PRIVATE
    ) {
      await this.confirmTransaction({
        orderId: order.tranOrderId,
        confirm: TransactionConst.STATUS_SUCCESS
      });
    }
    return order;
  };
  confirmTransaction = async (params: any) => {
    var order = await this.transactionValidator.validatorConfirm(params);
    var status = TransactionConst.STATUS_SUCCESS;
    if (params.confirm == 0) {
      status = TransactionConst.STATUS_FAILED;
    }
    return await this.confirmTransactionOrder(order, status);
  };
  statement = async (params: any) => {
    var data = await this.transactionValidator.validateStatement(params);

    let options: any = {};
    options.take = data.take;
    options.skip = data.skip;
    options.orderBy = data.orderBy;

    let where = {
      walletId: data.walletId,
      status: {
        in: [TransactionConst.STATUS_SUCCESS]
      },
      type: {
        in: [TransactionConst.INCOME, TransactionConst.OUTCOME]
      },
      dater: {
        gte: data.startDate,
        lte: data.endDate
      }
    };
    let select = {
      order: {
        include: {
          bankTransaction: true
        }
      }
    };
    let statementList: any = await this.transactionRepository.findAll(
      where,
      select,
      options
    );
    let beginBalance = await this.transactionRepository._prisma
      .$queryRaw`SELECT IFNULL(SUM(ss.amount),0) as amount FROM (SELECT SUM(tr.amount) AS amount,tr.walletId
        FROM \`Transaction\` tr
        WHERE tr.walletId=${data.walletId} AND tr.dater<${data.startDate} AND tr.status=${TransactionConst.STATUS_ACTIVE}
        GROUP BY tr.walletId
        UNION ALL 
        SELECT wb.balance-SUM(tr.amount),tr.walletId FROM \`Transaction\` tr
        INNER JOIN WalletBalance wb ON wb.walletId=tr.walletId
        WHERE tr.walletId=${data.walletId} AND tr.status=${TransactionConst.STATUS_ACTIVE} Group BY tr.walletId) ss`;
    let endBalance = await this.transactionRepository._prisma
      .$queryRaw`SELECT IFNULL(sum(ss.amount),0) AS amount FROM (SELECT IFNULL(SUM(tr.amount),0) AS amount,tr.walletId FROM 
        \`Transaction\` tr
        WHERE tr.walletId=${data.walletId} AND tr.dater<${data.startDate} AND tr.status=${TransactionConst.STATUS_ACTIVE} Group BY tr.walletId
        UNION all
        SELECT IFNULL(SUM(tr.amount),0) AS amount,tr.walletId FROM \`Transaction\` tr
        WHERE tr.walletId=${data.walletId} AND tr.dater BETWEEN ${data.startDate} AND ${data.endDate} AND tr.status=${TransactionConst.STATUS_ACTIVE} Group BY tr.walletId
        UNION ALL 
        SELECT wb.balance-SUM(tr.amount),tr.walletId FROM \`Transaction\` tr
        INNER JOIN WalletBalance wb ON wb.walletId=tr.walletId
        WHERE tr.walletId=${data.walletId} AND tr.status=${TransactionConst.STATUS_ACTIVE} Group BY tr.walletId) ss`;
    statementList.beginBalance = beginBalance[0].amount;
    statementList.endBalance = endBalance[0].amount;

    return statementList;
  };
  nominalStatement = async (params: any) => {
    var data = await this.transactionValidator.validateStatement(params);
    let options: any = {};
    options.take = data.take;
    options.skip = data.skip;
    options.orderBy = data.orderBy;
    let dateFilter;
    if (data.startDate != undefined && data.endDate != undefined) {
      dateFilter = {
        dater: {
          gte: data.startDate,
          lte: data.endDate
        }
      };
    }
    let where = {
      NOT: {
        wallet: {
          type: WalletConst.NOMINAL
        }
      },
      ...dateFilter,
      status: data.status
    };
    let select = {
      order: {
        include: {
          bankTransaction: true
        }
      },
      wallet: {
        include: {
          user: true
        }
      }
    };
    let statementList: any = await this.transactionRepository.findAll(
      where,
      select,
      options
    );
    statementList.beginBalance = 0;
    statementList.endBalance = 0;
    return statementList;
  };
  settlement = async (params: any) => {
    var data = await this.transactionValidator.validateSettlement(params);

    var transactionList = await this.transactionRepository.settlementTransaction(
      data
    );
    var totalInAmount = 0;
    var totalOutAmount = 0;
    var totalFeeAmount = 0;

    transactionList.forEach(transaction => {
      if (transaction.type == TransactionConst.INCOME) {
        totalInAmount += transaction.amount;
      }
      if (transaction.type == TransactionConst.FEE_INCOME) {
        totalFeeAmount += transaction.amount;
      }
      if (
        transaction.type == TransactionConst.OUTCOME ||
        transaction.type == TransactionConst.FEE_OUTCOME
      ) {
        totalOutAmount += transaction.amount;
      }
    });

    return await this.settlementRepository.create({
      walletId: data.walletId,
      startDate: data.startDate,
      endDate: data.endDate,
      type: SettlementConst.TYPE_WALLET,
      status: SettlementConst.STATUS_ACTIVE,
      totalOutAmount: totalOutAmount,
      totalInAmount: totalInAmount,
      totalFeeAmount: totalFeeAmount
    });
  };

  confirmTransactionOrder = async (order, status) => {
    var transactions: any = [];
    let stockName = '',
      percent = '';
    if (order?.mainOrder.length > 0 && order?.mainOrder[0].stock != undefined) {
      stockName = order?.mainOrder[0].stock.stockname;
      percent = order?.mainOrder[0].fee + '%';
    }
    let description: string | undefined = '';
    order.transactions.forEach((transaction: Transaction) => {
      if (stockName != '')
        description =
          transaction.type == TransactionConst.INCOME ||
          transaction.type == TransactionConst.OUTCOME
            ? stockName + ' хувьцааны арилжааны төлбөр'
            : stockName + ' хувьцааны арилжааны шимтгэл ' + percent;
      else description = transaction.description;
      switch (transaction.type) {
        case TransactionConst.INCOME:
        case TransactionConst.FEE_INCOME:
          var walletUpdate: any = undefined;
          walletUpdate = {
            update: {
              walletBalance: {
                update: {
                  balance: {
                    increment:
                      status == TransactionConst.STATUS_SUCCESS
                        ? transaction.amount
                        : 0
                  },
                  incomingBalance: {
                    decrement: transaction.amount
                  },
                  updatedAt: new Date()
                }
              }
            }
          };
          transactions.push({
            where: {
              id: transaction.id
            },
            data: {
              status: status,
              description: description,
              updatedAt: new Date(),
              wallet: walletUpdate
            }
          });
          break;
        case TransactionConst.FEE_OUTCOME:
        case TransactionConst.OUTCOME:
          transactions.push({
            where: {
              id: transaction.id
            },
            data: {
              status: status,
              description: description,
              updatedAt: new Date(),
              wallet: {
                update: {
                  walletBalance: {
                    update: {
                      balance: {
                        increment:
                          status == TransactionConst.STATUS_SUCCESS
                            ? transaction.amount
                            : 0
                      },
                      holdBalance: {
                        increment: transaction.amount
                      },
                      updatedAt: new Date()
                    }
                  }
                }
              }
            }
          });
          break;
      }
    });

    var data = {
      status: status,
      transactions: {
        update: transactions
      }
    };

    return await this.transactionOrderRepository.update(order.id, data);
  };

  createTransactionOrder = async (
    senderWallet: any,
    receiverWallet: any,
    data: any
  ) => {
    if (senderWallet == undefined && receiverWallet == undefined) {
      throw new Error('Invalid param exception');
    }
    var transactions: any = [];

    if (senderWallet != undefined) {
      if (data.amount != 0)
        transactions.push({
          walletId: senderWallet.id,
          type: TransactionConst.OUTCOME,
          status: TransactionConst.STATUS_PENDING,
          amount: data.amount * -1,
          dater: new Date(),
          beforeBalance: senderWallet.walletBalance.balance,
          afterBalance:
            parseFloat(senderWallet.walletBalance.balance) + data.amount * -1,
          description: data.description,
          createdAt: new Date()
        });
      let walletBalanceUpdate = {
        walletBalance: {
          update: {
            holdBalance: {
              increment:
                data.amount +
                (data.feeType == TransactionConst.FEE_TYPE_SENDER
                  ? data.feeAmount
                  : 0)
            },
            updatedAt: new Date()
          }
        }
      };
      await this.walletRepository.update(senderWallet.id, walletBalanceUpdate);
    }
    if (receiverWallet != undefined) {
      if (data.amount != 0) {
        transactions.push({
          walletId: receiverWallet.id,
          type: TransactionConst.INCOME,
          status: TransactionConst.STATUS_PENDING,
          amount: data.amount,
          dater: new Date(),
          beforeBalance: receiverWallet.walletBalance.balance,
          afterBalance:
            parseFloat(receiverWallet.walletBalance.balance) +
            parseFloat(data.amount),
          description: data.description,
          createdAt: new Date()
        });
        let walletBalanceUpdate = {
          walletBalance: {
            update: {
              incomingBalance: {
                increment:
                  parseFloat(data.amount) +
                  parseFloat(
                    data.feeType == TransactionConst.FEE_TYPE_SENDER
                      ? data.feeAmount
                      : 0
                  )
              },
              updatedAt: new Date()
            }
          }
        };
        await this.walletRepository.update(
          receiverWallet.id,
          walletBalanceUpdate
        );
      }
    }
    if (data.feeAmount > 0) {
      transactions.push({
        walletId: senderWallet.id,
        type:
          data.feeType == TransactionConst.FEE_TYPE_SENDER
            ? TransactionConst.FEE_OUTCOME
            : TransactionConst.FEE_INCOME,
        status: TransactionConst.STATUS_PENDING,
        amount:
          data.feeAmount *
          (data.feeType == TransactionConst.FEE_TYPE_SENDER ? -1 : 1),
        dater: new Date(),
        beforeBalance: senderWallet.walletBalance.balance,
        afterBalance:
          parseFloat(senderWallet.walletBalance.balance) +
          data.feeAmount *
            (data.feeType == TransactionConst.FEE_TYPE_SENDER ? -1 : 1),
        description:
          data.type == TransactionConst.TYPE_WITHDRAW
            ? 'Зарлагын шимтгэл'
            : 'Арилжааны шимтгэл',
        createdAt: new Date()
      });
      let receiverWalletId = this.walletValidator.validateGetNominalFeeWallet({
        currencyCode: senderWallet.currencyCode
      });
      if (receiverWalletId == senderWallet.id && receiverWallet != undefined) {
        receiverWalletId = receiverWallet.id;
      }
      if (data.type != TransactionConst.TYPE_WITHDRAW) {
        let feeReceiverWallet = await this.transactionValidator.checkWallet(
          {
            id: receiverWalletId
          },
          {
            walletBalance: true
          }
        );
        transactions.push({
          walletId: feeReceiverWallet.id,
          type:
            data.feeType == TransactionConst.FEE_TYPE_SENDER
              ? TransactionConst.FEE_INCOME
              : TransactionConst.FEE_OUTCOME,
          status: TransactionConst.STATUS_PENDING,
          amount:
            data.feeAmount *
            (data.feeType == TransactionConst.FEE_TYPE_SENDER ? 1 : -1),
          beforeBalance: feeReceiverWallet.walletBalance.balance,
          afterBalance:
            parseFloat(feeReceiverWallet.walletBalance.balance) -
            data.feeAmount *
              (data.feeType == TransactionConst.FEE_TYPE_SENDER ? 1 : -1),
          dater: new Date(),
          description: 'Арилжааны шимтгэл',
          createdAt: new Date()
        });
      }
      if (data.feeType == TransactionConst.FEE_TYPE_RECEIVER) {
        let walletBalanceUpdate = {
          walletBalance: {
            update: {
              holdBalance: {
                increment: data.feeAmount
              },
              updatedAt: new Date()
            }
          }
        };

        await this.walletRepository.update(
          receiverWallet.id,
          walletBalanceUpdate
        );
      }
    }

    var order = {
      walletIdFrom: senderWallet != undefined ? senderWallet.id : undefined,
      walletIdTo: receiverWallet != undefined ? receiverWallet.id : undefined,
      amount: data.amount,
      feeAmount: data.feeAmount,
      type: data.type,
      status: TransactionConst.STATUS_PENDING,
      dater: new Date(),
      createdAt: new Date(),
      transactions: {
        create: transactions
      }
    };

    return await this.transactionOrderRepository.create(order);
  };

  participateTransaction = async params => {
    var { data, order } = await this.transactionValidator.validateParticipate(
      params
    );
    var transactions: any = [];
    var newTransactions: any = [];

    order.transactions.forEach(transaction => {
      var amount: any = undefined;
      switch (transaction.type) {
        case TransactionConst.INCOME:
          amount = {
            decrement: data.amount
          };
          newTransactions.push({
            walletId: transaction.walletId,
            type: transaction.type,
            status: transaction.status,
            amount: data.amount,
            dater: new Date(),
            beforeBalance: 0,
            afterBalance: 0
          });
          break;
        case TransactionConst.FEE_INCOME:
          amount = {
            decrement: data.feeAmount
          };
          newTransactions.push({
            walletId: transaction.walletId,
            type: transaction.type,
            status: transaction.status,
            amount: data.feeAmount,
            dater: new Date(),
            beforeBalance: 0,
            afterBalance: 0
          });
          break;
        case TransactionConst.OUTCOME:
          amount = {
            increment: data.amount
          };
          newTransactions.push({
            walletId: transaction.walletId,
            type: transaction.type,
            status: transaction.status,
            amount: data.amount * -1,
            dater: new Date(),
            beforeBalance: 0,
            afterBalance: 0
          });
          break;
        case TransactionConst.FEE_OUTCOME:
          amount = {
            increment: data.feeAmount
          };
          newTransactions.push({
            walletId: transaction.walletId,
            type: transaction.type,
            status: transaction.status,
            amount: data.feeAmount * -1,
            dater: new Date(),
            beforeBalance: 0,
            afterBalance: 0
          });
          break;
      }
      transactions.push({
        where: {
          id: transaction.id
        },
        data: {
          updatedAt: new Date(),
          amount: amount
        }
      });
    });

    var updateOrder = {
      amount: {
        decrement: data.amount
      },
      feeAmount: {
        decrement: data.feeAmount
      },
      transactions: {
        update: transactions
      }
    };

    var [
      ,
      newOrder
    ] = await this.transactionOrderRepository.participateTransaction(
      {
        where: {
          id: order.id
        },
        data: updateOrder
      },
      {
        data: {
          walletIdFrom: order.walletIdFrom,
          walletIdTo: order.walletIdTo,
          amount: data.amount,
          feeAmount: data.feeAmount,
          type: order.type,
          status: order.status,
          dater: new Date(),
          transactions: {
            createMany: {
              data: newTransactions
            }
          },
          parentOrderId: order.id
        }
      }
    );

    return newOrder;
  };
  transactionStatement = async (params: any) => {
    let dateFilter = '';
    if (params.startDate != undefined && params.endDate != undefined) {
      dateFilter =
        " and tr.dater between '" +
        moment(params.startDate).format('YYYY-MM-DD') +
        "' and '" +
        moment(params.endDate).format('YYYY-MM-DD') +
        "'";
    }
    let walletFilter = '';
    if (params.walletId) {
      walletFilter = `and (tr.walletIdFrom=${params.walletId} or tr.walletIdTo=${params.walletId})`;
    }
    let sql =
      `SELECT 
    tr.type,tr.dater,tr.createdAt,stock.stockname,
    stock.stockcode,stock.symbol,tr.amount+tr.feeAmount as totalAmount,
    case 
    when (tr.type=${TransactionConst.TYPE_CHARGE} and tr.status=${TransactionConst.STATUS_ACTIVE}) then tr.amount+tr.feeAmount
    when (tr.type=${TransactionConst.TYPE_W2W} and o.txntype=${OrderTxnType.Sell} and tr.status=${TransactionConst.STATUS_ACTIVE}) then tr.amount
    else 0 end as income,
    case when (tr.type=${TransactionConst.TYPE_W2W} and o.txntype=${OrderTxnType.Buy} and tr.status=${TransactionConst.STATUS_ACTIVE}) then tr.amount+tr.feeAmount else 0 end as outcome,
    case  
    when (tr.type=${TransactionConst.TYPE_WITHDRAW} and tr.status=${TransactionConst.STATUS_PENDING}) then tr.amount+tr.feeAmount
    when (tr.type=${TransactionConst.TYPE_W2W} and o.txntype=${OrderTxnType.Sell} and tr.status=${TransactionConst.STATUS_PENDING}) then tr.amount
    else 0 end as expectedIncome,
    case when (tr.type=${TransactionConst.TYPE_W2W} and o.txntype=${OrderTxnType.Buy} and tr.status=${TransactionConst.STATUS_PENDING}) then tr.amount+tr.feeAmount else 0 end as expectedOutcome,
    tr.feeAmount,o.price
 FROM
     \`TransactionOrder\` tr 
 left join \`Order\` o on o.tranOrderId=tr.id 
 left join \`Stock\` stock on stock.stockcode=o.stockcode
 left join \`StockOrder\` stOrder on stOrder.id=o.stockOrderId
 where (tr.status=${TransactionConst.STATUS_ACTIVE} or tr.status=${TransactionConst.STATUS_PENDING})` +
      dateFilter +
      walletFilter;
    let statementList = await this.transactionRepository._prisma.$queryRawUnsafe(
      sql
    );
    let dataList = {
      total: statementList.length,
      count: statementList.length,
      values: statementList
    };
    return dataList;
  };
}
export default TransactionService;
