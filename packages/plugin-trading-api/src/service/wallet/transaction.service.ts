import { TransactionValidator } from '../validator/wallet/transaction.validator';
import {
  SettlementConst,
  TransactionConst,
  WalletConst
} from '../../constants/wallet';
import TransactionRepository from '../../repository/wallet/transaction.repository';
import SettlementRepository from '../../repository/wallet/settlement.repository';
import TransactionOrderRepository from '../../repository/wallet/transaction.order.repository';
import WalletRepository from '../../repository/wallet/wallet.repository';
class TransactionService {
  private transactionValidator: TransactionValidator;
  private transactionRepository: TransactionRepository;
  private settlementRepository: SettlementRepository;
  private transactionOrderRepository: TransactionOrderRepository;
  private walletRepository: WalletRepository;
  constructor() {
    this.transactionValidator = new TransactionValidator();
    this.transactionRepository = new TransactionRepository();
    this.settlementRepository = new SettlementRepository();
    this.transactionOrderRepository = new TransactionOrderRepository();
    this.walletRepository = new WalletRepository();
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
    let options: any;
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
    let statementList = await this.transactionRepository.findMany(
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
    console.log('Order', order?.mainOrder[0]);
    if (order?.mainOrder.length > 0 && order?.mainOrder[0].stock != undefined) {
      stockName = order?.mainOrder[0].stock.stockname;
      percent = order?.mainOrder[0].fee + '%';
    }
    let description = '';
    order.transactions.forEach(transaction => {
      if (order.type == TransactionConst.TYPE_W2W)
        description =
          transaction.type == TransactionConst.INCOME ||
          transaction.type == TransactionConst.OUTCOME
            ? stockName + ' Хувьцааны төлбөр'
            : stockName + ' Хувьцааны арилжааны шимтгэл ' + percent;
      else description = transaction.description;
      switch (transaction.type) {
        case TransactionConst.INCOME:
        case TransactionConst.FEE_INCOME:
          var walletUpdate: any = undefined;
          if (status == TransactionConst.STATUS_SUCCESS) {
            walletUpdate = {
              update: {
                walletBalance: {
                  update: {
                    balance: {
                      increment: transaction.amount
                    },
                    updatedAt: new Date()
                  }
                }
              }
            };
          }
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
          beforeBalance: senderWallet.balance,
          afterBalance: senderWallet.balance + data.amount * -1,
          description: data.description,
          createdAt: new Date()
        });
      var walletBalanceUpdate = {
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
      if (data.amount != 0)
        transactions.push({
          walletId: receiverWallet.id,
          type: TransactionConst.INCOME,
          status: TransactionConst.STATUS_PENDING,
          amount: data.amount,
          dater: new Date(),
          beforeBalance: receiverWallet.balance,
          afterBalance: receiverWallet.balance + data.amount,
          description: data.description,
          createdAt: new Date()
        });
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
        beforeBalance: senderWallet.balance,
        afterBalance:
          senderWallet.balance +
          data.feeAmount *
            (data.feeType == TransactionConst.FEE_TYPE_SENDER ? -1 : 1),
        description:
          data.type == TransactionConst.TYPE_WITHDRAW
            ? 'Зарлагын шимтгэл'
            : 'Арилжааны шимтгэл',
        createdAt: new Date()
      });
      let receiverWalletId = WalletConst.FEE_RECEIVER;
      if (receiverWalletId == senderWallet.id && receiverWallet != undefined) {
        receiverWalletId = receiverWallet.id;
      }
      if (data.type != TransactionConst.TYPE_WITHDRAW) {
        transactions.push({
          walletId: receiverWalletId,
          type:
            data.feeType == TransactionConst.FEE_TYPE_SENDER
              ? TransactionConst.FEE_INCOME
              : TransactionConst.FEE_OUTCOME,
          status: TransactionConst.STATUS_PENDING,
          amount:
            data.feeAmount *
            (data.feeType == TransactionConst.FEE_TYPE_SENDER ? 1 : -1),
          beforeBalance: senderWallet.balance,
          afterBalance:
            senderWallet.balance +
            data.feeAmount *
              (data.feeType == TransactionConst.FEE_TYPE_SENDER ? -1 : 1),
          dater: new Date(),
          description: 'Арилжааны шимтгэл',
          createdAt: new Date()
        });
      }
      if (data.feeType == TransactionConst.FEE_TYPE_RECEIVER) {
        var walletBalanceUpdate = {
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
            dater: new Date()
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
            dater: new Date()
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
            dater: new Date()
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
            dater: new Date()
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
}
export default TransactionService;
