import BaseRepository from './base.repository';

export default class StockRepository extends BaseRepository {
  constructor() {
    super('stock');
  }
  update = async (entity: any, select: any = undefined) => {
    return await this._prisma[this._model].update({
      where: { id: entity.id },
      data: entity,
      include: select
    });
  };

  delete = async (entity: any) => {
    return await this._prisma[this._model].delete({
      where: { stockcode: entity.stockcode }
    });
  };

  getByStockcode = (stockcode: number) =>
    this._prisma.stock.findUnique({
      where: {
        stockcode: stockcode
      }
    });

  getByExternalId = (externalId: string) =>
    this._prisma.stock.findMany({
      where: {
        externalid: externalId
      }
    });
}
