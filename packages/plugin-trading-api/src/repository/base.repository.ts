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
  findFirst = async (where: any = undefined, include: any = undefined) => {
    return await this._prisma[this._model].findFirst({
      where: where,
      include: include
    });
  };
  findMany = async (
    where: any = undefined,
    include: any = undefined,
    options: any = undefined
  ) => {
    return await this._prisma[this._model].findMany({
      where,
      include,
      options
    });
  };
  findUnique = async (where: any = undefined, include: any = undefined) =>
    await this._prisma[this._model].findUnique({
      where,
      include
    });
  create = (entity: any, select: any = undefined, include: any = undefined) => {
    if (prisma != undefined)
      return prisma[this._model].create({ data: entity, select, include });
    else
      return this._prisma[this._model].create({
        data: entity,
        select,
        include
      });
  };

  createMany = (entity: any, select: any = undefined) =>
    this._prisma[this._model].createMany({ data: entity, select });

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

  delete = async (id: Number | string) =>
    await this._prisma[this._model].delete({ where: { id: +id } });
}
