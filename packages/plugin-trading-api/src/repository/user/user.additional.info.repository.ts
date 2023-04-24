import BaseRepository from '../base.repository';

export default class UserAdditionalInfoRepository extends BaseRepository {
  static instance: any = null;

  static get() {
    if (this.instance == null) {
      this.instance = new UserAdditionalInfoRepository();
    }

    return this.instance;
  }

  constructor() {
    super('userAdditionalInfo');
  }

  participateTransaction = async (updateQuery, createQuery) => {
    return await this._prisma.$transaction([
      this._prisma[this._model].updateMany(updateQuery),
      this._prisma[this._model].create(createQuery)
    ]);
  };

  updateMany = async schema =>
    await this._prisma[this._model].updateMany(schema);
}
