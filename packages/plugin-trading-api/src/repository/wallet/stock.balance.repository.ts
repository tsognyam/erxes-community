import BaseRepository from '../base.repository';

export default class StockBalanceRepository extends BaseRepository {
  constructor() {
    super('stockBalance');
  }
  findByWalletId = async (
    walletId: number,
    status: number,
    stockCode: string | undefined,
    include: any = undefined
  ) => {
    return await this._prisma[this._model].findMany({
      where: {
        walletId: walletId,
        wallet: {
          status: status
        },
        stockCode: stockCode
      },
      include: include
    });
  };

  stockOwners = async (stockCode: string) => {
    return await this._prisma[this._model].findMany({
      where: {
        stockCode: stockCode,
        NOT: {
          balance: 0,
          holdBalance: 0
        }
      },
      select: {
        stockCode: true,
        balance: true,
        holdBalance: true,
        wallet: {
          select: {
            user: {
              select: {
                id: true,
                familyName: true,
                lastName: true,
                firstName: true,
                registerNumber: true
              }
            }
          }
        }
      }
    });
  };
}
