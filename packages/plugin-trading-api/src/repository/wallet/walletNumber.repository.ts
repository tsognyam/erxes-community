import BaseRepository from '../base.repository';

export class WalletNumberRepository extends BaseRepository {
  constructor() {
    super('walletNumber');
  }
  updateByNumber = async (number: string, entity) => {
    return await this._prisma[this._model].update({
      where: { number: +number },
      data: entity
    });
  };
}
