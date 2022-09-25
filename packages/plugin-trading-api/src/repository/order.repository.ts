import BaseRepository from './base.repository';
import { OrderStatus, StockConst, StockTypeConst } from '../constants/stock';
import { TransactionConst } from '../constants/wallet';
export default class OrderRepository extends BaseRepository {
  constructor() {
    super('order');
  }
  findOne = (id: number) => {
    return this._prisma[this._model].findUnique({
      where: {
        txnid: id
      }
    });
  };
  update = async (entity: any, select: any = undefined) => {
    return await this._prisma[this._model].update({
      where: { txnid: entity.txnid },
      data: entity,
      include: select
    });
  };
  getOrderCondition = (id: number) => {
    return this._prisma.ordercondition.findUnique({
      where: {
        id: id
      }
    });
  };
  getOrderType = (id: number) => {
    return this._prisma.ordertype.findUnique({
      where: {
        id: id
      }
    });
  };
  getbyExecuted = (where: any) => {
    return this._prisma.order.findMany(where);
  };

  getOrderListBySettlement = (
    userId: string,
    tradeDate: Date,
    issuerCode: string
  ) => {
    let startDate = new Date(tradeDate);
    startDate.setUTCHours(0, 0, 0, 0);
    let endDate = new Date(tradeDate);
    endDate.setUTCHours(24, 0, 0, 0);
    return this._prisma.order.findMany({
      where: {
        userId: userId,
        donedate: {
          gte: startDate,
          lt: endDate
        },
        status: {
          in: [OrderStatus.STATUS_FILLED, OrderStatus.STATUS_PARTIALLY_FILLED]
        },
        OR: [
          {
            transactionOrder: {
              status: TransactionConst.STATUS_PENDING
            }
          },
          {
            stockOrder: {
              status: TransactionConst.STATUS_SUCCESS
            }
          }
        ],
        stock: {
          symbol: issuerCode
        },
        settlementMCSDId: null
      },
      include: {
        transactionOrder: true,
        stockOrder: true,
        stock: true
      }
    });
  };

  getOrderList = (userId, tradeDate) => {
    let startDate = new Date(tradeDate);
    startDate.setUTCHours(0, 0, 0, 0);
    let endDate = new Date(tradeDate);
    endDate.setUTCHours(24, 0, 0, 0);
    return this._prisma.order.findMany({
      where: {
        userId: userId,
        donedate: {
          gte: startDate,
          lt: endDate
        },
        status: {
          in: [OrderStatus.STATUS_FILLED, OrderStatus.STATUS_PARTIALLY_FILLED]
        },
        ipo: StockConst.SO,
        stock: {
          stocktypeId: {
            in: [
              StockTypeConst.SEC,
              StockTypeConst.COMPANY_BOND,
              StockTypeConst.GOV_BOND
            ]
          }
        }
      },
      include: {
        transactionOrder: true,
        stockOrder: true,
        stock: true
      }
    });
  };
}
