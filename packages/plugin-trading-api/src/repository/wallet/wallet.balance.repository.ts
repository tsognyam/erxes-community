import BaseRepository from '../base.repository';
export default class WalletBalanceRepository extends BaseRepository {
  constructor() {
    super('walletBalance');
  }
  findByWalletId = async (walletId: number | undefined) => {
    let where = {};

    if (undefined !== walletId) {
      where = {
        walletId: walletId
      };
    }
    return await this.findMany(where);
  };
}
