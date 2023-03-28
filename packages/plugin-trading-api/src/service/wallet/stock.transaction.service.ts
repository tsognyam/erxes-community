import StockBalanceRepository from '../../repository/wallet/stock.balance.repository';
import StockOrderRepository from '../../repository/wallet/stock.transaction.order.repository';
import StockTransactionRepository from '../../repository/wallet/stock.transaction.repository';
import StockTransactionValidator from '../validator/wallet/stock.transaction.validator';
import StockWalletValidator from '../validator/wallet/stock.wallet.validator';
import { TransactionConst } from '../../constants/wallet';
import { ErrorCode, CustomException } from '../../exception/error-code';
export default class StockTransactionService {
  private stockTransactionOrderRepository: StockOrderRepository;
  private stockTransactionValidator: StockTransactionValidator;
  private stockWalletValidator: StockWalletValidator;
  private stockBalanceRepository: StockBalanceRepository;
  private stockTransactionRepository: StockTransactionRepository;
  constructor() {
    this.stockTransactionOrderRepository = new StockOrderRepository();
    this.stockTransactionValidator = new StockTransactionValidator();
    this.stockWalletValidator = new StockWalletValidator();
    this.stockBalanceRepository = new StockBalanceRepository();
    this.stockTransactionRepository = new StockTransactionRepository();
  }
  statement = async params => {
    var data = await this.stockTransactionValidator.validateStatement(params);
    let options: any = {};
    options.take = data.take;
    options.skip = data.skip;
    options.orderBy = data.orderBy;
    data.skip = undefined;
    data.take = undefined;
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
      stock: true,
      stockOrder: {
        select: {
          mainOrder: {
            select: {
              donedate: true,
              donecnt: true,
              doneprice: true,
              fee: true
            }
          }
        }
      }
    };
    let res: any = await this.stockTransactionRepository.findAll(
      where,
      select,
      options
    );
    let beginBalance = await this.stockTransactionRepository._prisma
      .$queryRaw`SELECT SUM(tr.stockCount) AS stockCount,tr.stockCode,tr.walletId
        FROM \`StockTransaction\` tr
        WHERE tr.walletId=${data.walletId} AND tr.dater<${data.startDate} AND tr.status=${TransactionConst.STATUS_ACTIVE}
        GROUP BY tr.walletId, tr.stockCode
        `;
    let endBalance = await this.stockTransactionRepository._prisma
      .$queryRaw`SELECT IFNULL(sum(ss.stockCount),0) AS stockCount, ss.walletId, ss.stockCode FROM 
      (SELECT IFNULL(SUM(tr.stockCount),0) AS stockCount,tr.walletId, tr.stockCode FROM \`StockTransaction\` tr WHERE tr.walletId=${data.walletId} AND tr.dater<${data.startDate} AND tr.status=1 Group BY tr.walletId, tr.stockCode UNION all SELECT IFNULL(SUM(tr.stockCount),0) AS stockCount,tr.walletId,tr.stockCode FROM \`StockTransaction\` tr WHERE tr.walletId=${data.walletId} AND tr.dater BETWEEN ${data.startDate} AND ${data.endDate} AND tr.status=${TransactionConst.STATUS_ACTIVE} Group BY tr.walletId, tr.stockCode ) ss group by ss.walletId, ss.stockCode;`;
    res.beginBalance = beginBalance;
    res.endBalance = endBalance;

    return res;
  };
  w2w = async params => {
    var {
      data,
      senderBalance,
      receiverBalance
    } = await this.stockTransactionValidator.validateW2W(params);

    return await this.createTransactionOrder(
      senderBalance,
      receiverBalance,
      data
    );
  };

  confirmTransaction = async params => {
    var order = await this.stockTransactionValidator.validatorConfirm(params);
    var status = TransactionConst.STATUS_SUCCESS;
    if (params.confirm == 0) {
      status = TransactionConst.STATUS_FAILED;
    }

    return await this.confirmTransactionOrder(order, status);
  };
  confirmTransactionOrder = async (order, status) => {
    var transactions: any = [];

    for (const transaction of order.stockTransactions) {
      var stockBalance = await this.stockWalletValidator.validateBalance({
        walletId: transaction.walletId,
        stockCode: order.stockCode
      });

      switch (transaction.type) {
        case TransactionConst.INCOME:
          var walletUpdate: any = undefined;
          if (status == TransactionConst.STATUS_SUCCESS) {
            var stockBalancePrisma = undefined;
            if (stockBalance.id != undefined) {
              walletUpdate = {
                update: {
                  stockBalances: {
                    update: {
                      where: {
                        id: stockBalance.id
                      },
                      data: {
                        balance: {
                          increment: order.stockCount
                        },
                        updatedAt: new Date()
                      }
                    }
                  }
                }
              };
            } else {
              walletUpdate = {
                update: {
                  stockBalances: {
                    createMany: {
                      data: [
                        {
                          stockCode: order.stockCode,
                          balance: order.stockCount,
                          holdBalance: 0
                        }
                      ]
                    }
                  }
                }
              };
            }
          }
          transactions.push({
            where: {
              id: transaction.id
            },
            data: {
              status: status,
              updatedAt: new Date(),
              wallet: walletUpdate
            }
          });
          break;
        case TransactionConst.OUTCOME:
          var walletUpdate: any = undefined;
          if (stockBalance.id != undefined) {
            walletUpdate = {
              update: {
                stockBalances: {
                  update: {
                    where: {
                      id: stockBalance.id
                    },
                    data: {
                      balance: {
                        decrement:
                          status == TransactionConst.STATUS_SUCCESS
                            ? order.stockCount
                            : 0
                      },
                      holdBalance: {
                        decrement: order.stockCount
                      },
                      updatedAt: new Date()
                    }
                  }
                }
              }
            };
          } else {
            walletUpdate = {
              update: {
                stockBalances: {
                  createMany: {
                    data: [
                      {
                        stockCode: order.stockCode,
                        balance: order.stockCount * -1,
                        holdBalance: 0
                      }
                    ]
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
              updatedAt: new Date(),
              wallet: walletUpdate
            }
          });
          break;
      }
    }

    var data = {
      status: status,
      stockTransactions: {
        update: transactions
      }
    };

    return await this.stockTransactionOrderRepository.update(order.id, data);
  };

  createTransactionOrder = async (senderBalance, receiverBalance, params) => {
    if (senderBalance == undefined && receiverBalance == undefined) {
      CustomException(ErrorCode.InvalidParamException);
    }
    var transactions: any = [];
    if (!params.dater) params.dater = new Date();
    if (senderBalance != undefined) {
      transactions.push({
        walletId: senderBalance.walletId,
        type: TransactionConst.OUTCOME,
        status: TransactionConst.STATUS_PENDING,
        stockCount: params.stockCount,
        stockCode: params.stockCode,
        dater: params.dater,
        price: !params.price ? 0 : params.price,
        fee: !params.fee ? 0 : params.fee,
        description: params.description
      });
      var walletBalanceUpdate = {
        holdBalance: {
          increment: params.stockCount
        }
      };

      if (senderBalance.id != undefined) {
        await this.stockBalanceRepository.update(
          senderBalance.id,
          walletBalanceUpdate
        );
      } else {
        await this.stockBalanceRepository.create({
          walletId: senderBalance.walletId,
          stockCode: params.stockCode,
          balance: 0,
          holdBalance: params.stockCount
        });
      }
    }
    if (receiverBalance != undefined) {
      transactions.push({
        walletId: receiverBalance.walletId,
        type: TransactionConst.INCOME,
        status: TransactionConst.STATUS_PENDING,
        stockCount: params.stockCount,
        stockCode: params.stockCode,
        dater: params.dater,
        price: !params.price ? 0 : params.price,
        fee: !params.fee ? 0 : params.fee,
        description: params.description
      });
    }

    var order = {
      walletIdFrom:
        senderBalance != undefined ? senderBalance.walletId : undefined,
      walletIdTo:
        receiverBalance != undefined ? receiverBalance.walletId : undefined,
      stockCount: params.stockCount,
      stockCode: params.stockCode,
      type: params.type,
      status: TransactionConst.STATUS_PENDING,
      dater: params.dater,
      stockTransactions: {
        create: transactions
      }
    };

    return await this.stockTransactionOrderRepository.create(order);
  };

  participateTransaction = async params => {
    var {
      data,
      order
    } = await this.stockTransactionValidator.validateParticipate(params);
    var transactions: any = [];
    var newTransactions: any = [];

    order.stockTransactions.forEach(transaction => {
      var stockCount: any = undefined;
      switch (transaction.type) {
        case TransactionConst.INCOME:
          stockCount = {
            decrement: data.stockCount
          };
          newTransactions.push({
            walletId: transaction.walletId,
            type: transaction.type,
            status: transaction.status,
            stockCount: data.stockCount,
            stockCode: order.stockCode,
            dater: new Date()
          });
          break;
        case TransactionConst.OUTCOME:
          stockCount = {
            increment: data.stockCount
          };
          newTransactions.push({
            walletId: transaction.walletId,
            type: transaction.type,
            status: transaction.status,
            stockCount: data.stockCount * -1,
            stockCode: order.stockCode,
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
          stockCount: stockCount
        }
      });
    });

    var updateOrder = {
      stockCount: {
        decrement: data.stockCount
      },
      stockTransactions: {
        update: transactions
      }
    };

    var [
      ,
      newOrder
    ] = await this.stockTransactionOrderRepository.participateTransaction(
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
          stockCount: data.stockCount,
          stockCode: order.stockCode,
          type: order.type,
          status: order.status,
          dater: new Date(),
          stockTransactions: {
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
