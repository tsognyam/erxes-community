import BaseRepository from '../base.repository';
import { TransactionConst } from '../../constants/wallet';
export default class TransactionRepository extends BaseRepository {
  constructor() {
    super('transaction');
  }
  statement = async (data: any) => {
    return await this._prisma[this._model].findMany(
      {
        where: {
          walletId: data.walletId,
          status: {
            in: [TransactionConst.STATUS_SUCCESS]
          },
          type: {
            in: [TransactionConst.TYPE_W2W, TransactionConst.TYPE_WITHDRAW]
          },
          dater: {
            gte: data.startDate,
            lt: data.endDate
          }
        },
        skip: data.skip,
        take: data.take,
        orderBy: {
          dater: 'desc'
        }
      },
      {
        include: {
          Order: {
            symbol: true
          }
        }
      }
    );
  };

  settlementTransaction = async (data: any) => {
    return await this._prisma[this._model].findMany({
      where: {
        walletId: data.walletId,
        status: TransactionConst.STATUS_SUCCESS,
        dater: {
          from_gre: data.startDate,
          to_lte: data.endDate
        }
      }
    });
  };
}
