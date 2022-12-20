import BaseRepository from '../base.repository';

export default class UserRelationRepository extends BaseRepository {
  static instance:any = null;

  static get() {
    if (this.instance == null) {
      this.instance = new UserRelationRepository();
    }

    return this.instance;
  }

  constructor() {
    super('userRelation');
  }

  participateTransaction = async (updateQuery, createQuery) => {
    return await this._prisma.$transaction([
      this._prisma[this._model].updateMany(updateQuery),
      this._prisma[this._model].createMany(createQuery),
    ]);
  };
}

