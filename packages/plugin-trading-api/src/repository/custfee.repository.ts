import BaseRepository from './base.repository';

export default class CustfeeRepository extends BaseRepository {
  constructor() {
    super('custfee');
  }
  getFee = async (stocktypeId: number | undefined) => {
    let where = {};

    if (undefined !== stocktypeId) {
      where = {
        id: stocktypeId
      };
    }
    return await this._prisma['stocktype'].findMany({
      where
    });
  };

  findbyUserId = async (userId: number | undefined) => {
    let where = {};

    if (undefined !== userId) {
      where = {
        userId: userId
      };
    }

    return await this._prisma[this._model].findMany({
      where
    });
  };

  findbyUserIdWithType = async (
    userId: number | undefined,
    stocktypeId: number
  ) => {
    let where = {};

    if (undefined !== userId) {
      where = {
        userId: userId,
        stocktypeId: stocktypeId
      };
    }

    return await this._prisma[this._model].findMany({
      where
    });
  };
}
