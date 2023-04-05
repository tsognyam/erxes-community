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
prisma.$on('query', e => {});
export default class BaseRepository {
  static STATUS_ACTIVE = 1;
  static STATUS_INACTIVE = 2;
  _model;
  _prisma;
  constructor(model: any) {
    this._model = model;
    this._prisma = prisma;
  }
  find = async (where: any, select: any = undefined) =>
    await this._prisma[this._model].findMany({
      where,
      include: select
    });
  findById = async (id: number, select: any = undefined) =>
    await this._prisma[this._model].findUnique({
      where: { id: +id },
      include: select
    });
  findFirst = async (where: any = undefined, include: any = undefined) => {
    return await this._prisma[this._model].findFirst({
      where: where,
      include: include
    });
  };
  findAll = async (
    where: any = undefined,
    select: any = undefined,
    options: any = []
  ) => {
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
  findMany = async (
    where: any = undefined,
    include: any = undefined,
    options: any = undefined
  ) => {
    return await this._prisma[this._model].findMany({
      where,
      include,
      ...options
    });
  };
  findUnique = async (where: any = undefined, include: any = undefined) =>
    await this._prisma[this._model].findUnique({
      where,
      include
    });
  create = async (
    entity: any,
    select: any = undefined,
    include: any = undefined
  ) => {
    return await this._prisma[this._model].create({
      data: entity,
      select,
      include
    });
  };

  createMany = async (entity: any, select: any = undefined) => {
    return await this._prisma[this._model].createMany({ data: entity, select });
  };
  update = async (id: number, entity: any, select: any = undefined) => {
    return await this._prisma[this._model].update({
      where: { id: +id },
      data: entity,
      include: select
    });
  };
  updateMany = async (where: any = undefined, data: any = undefined) => {
    return await this._prisma[this._model].updateMany({
      where: where,
      data: data
    });
  };

  delete = async (id: number | string) =>
    await this._prisma[this._model].delete({ where: { id: +id } });
}
