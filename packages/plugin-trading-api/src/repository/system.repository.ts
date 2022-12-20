import Helper from '../middleware/helper.service';
import BaseRepository from './base.repository';

export default class SystemRepository extends BaseRepository {
  static instance;

  static get() {
    if (this.instance == null) {
      this.instance = new SystemRepository();
    }

    return this.instance;
  }

  constructor() {
    super('system');
  }

  getbyName = (name) =>
    this._prisma[this._model].findMany({
      where: {
        name,
      },
    });
}
