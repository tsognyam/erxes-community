import BaseRepository from '../base.repository';

export default class StockOrderRepository extends BaseRepository {
  constructor() {
    super('stockOrder');
  }
  participateTransaction = async (updateQuery: any, createQuery: any) => {
    return await this._prisma.$transaction([
      this._prisma[this._model].update(updateQuery),
      this._prisma[this._model].create(createQuery)
    ]);
  };
}
