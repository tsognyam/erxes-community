import BaseConst from './base';

class WalletConst extends BaseConst {
  static readonly WALLET_TYPES = {
    NOMINAL: 1,
    USER: 2,
    ADMIN: 3,
    MCSD: 4
  };
}
export default WalletConst;
