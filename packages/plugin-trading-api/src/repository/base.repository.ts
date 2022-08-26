import { prisma } from '../configs';
class BaseRepository {
  static STATUS_ACTIVE = 1;
  static STATUS_INACTIVE = 2;
  _model = null;
  _prisma = null;
  constructor(model) {
    this._model = model;
    this._prisma = prisma;
  }
}
