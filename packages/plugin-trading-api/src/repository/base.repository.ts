import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query'
    },
    {
      emit: 'event',
      level: 'error'
    },
    {
      emit: 'event',
      level: 'warn'
    }
  ]
});
prisma.$on('query', e => {
  console.log('query=', e.query);
  console.warn('queryParams=', e.params);
});
interface options {
  skip: Number;
  take: Number;
  orderBy: string;
}
class BaseRepository {
  static STATUS_ACTIVE = 1;
  static STATUS_INACTIVE = 2;
  _model;
  _prisma;
  constructor(model) {
    this._model = model;
    this._prisma = prisma;
  }
  findAll = async (where = undefined, select = undefined, options: options) => {
    let data = await this._prisma[this._model].findMany({
      skip: options != undefined ? options.skip : undefined,
      take: options != undefined ? options.take : undefined,

      where,
      include: select,
      orderBy: options != undefined ? options.orderBy : undefined
    });

    let total = await this._prisma[this._model].count({
      where
      // include: select,
    });

    let res = {
      total: total,
      count: data.length,
      values: data
    };

    return res;
  };

  findByStatus = (status, select = undefined) =>
    this._prisma[this._model].findMany({
      include: select,
      where: {
        status: +status
      }
    });

  findById = async (id, select = undefined) =>
    await this._prisma[this._model].findUnique({
      where: { id: +id },
      include: select
    });
  find = async (where, select = undefined) =>
    await this._prisma[this._model].findMany({
      where,
      include: select
    });
  create = (entity, select = undefined, include = undefined) => {
    console.log(this._model);
    console.log(entity);
    return this._prisma[this._model].create({ data: entity, select, include });
  };

  createMany = (entity, select = undefined) =>
    this._prisma[this._model].createMany({ data: entity, select });

  update = async (id, entity, select = undefined) => {
    // if (!entity.updatedAt) {
    //   entity.updatedAt = new Date();
    // }

    return await this._prisma[this._model].update({
      where: { id: +id },
      data: entity,
      include: select
    });
  };
  updateMany = async (where, data) => {
    return await this._prisma[this._model].updateMany({
      where: where,
      data: data
    });
  };

  delete = async id =>
    await this._prisma[this._model].delete({ where: { id: +id } });
}
export default BaseRepository;
