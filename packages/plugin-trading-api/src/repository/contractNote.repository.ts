import BaseRepository from './base.repository';

class ContractNoteRepository extends BaseRepository {
  constructor() {
    super('contractNote');
  }
  findbyTradeId = async (tradeId, buySell) => {
    let where = {};

    if (undefined !== tradeId) {
      where = {
        tradeId: tradeId,
        buySell: buySell
      };
    }

    return await this._prisma[this._model].findMany({
      where
    });
  };
}

export default ContractNoteRepository;
