import { PrismaClient } from '@prisma/client';
import { WSAEHOSTUNREACH } from 'constants';
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
class BaseRepository {
  static STATUS_ACTIVE = 1;
  static STATUS_INACTIVE = 2;
  _model;
  _prisma;
  constructor(model) {
    this._model = model;
    this._prisma = prisma;
  }
  findFirst = async (where: any = undefined, include: any = undefined) => {
    return await this._prisma[this._model].findFirst({
      where: where,
      include: include
    });
  };
  findMany = async (where, include: any = undefined) => {
    return await this._prisma[this._model].findMany({
      where,
      include
    });
  };
  findUnique = async (where, include = undefined) =>
    await this._prisma[this._model].findUnique({
      where,
      include
    });
  create = (entity, select: any = undefined, include: any = undefined) => {
    return this._prisma[this._model].create({ data: entity, select, include });
  };

  createMany = (entity, select: any = undefined) =>
    this._prisma[this._model].createMany({ data: entity, select });

  update = async (id, entity, select = undefined) => {
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
