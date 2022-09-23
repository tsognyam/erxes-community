import { EROFS } from 'constants';
import WalletConst from '../../../constants/wallets';
import { WalletRepository } from '../../../repository/wallet/wallet.repository';
import BaseValidator from '../base.validator';
class WalletValidator extends BaseValidator {
  private walletRepository: WalletRepository = new WalletRepository();

  checkWallet = async (
    id,
    status = WalletConst.STATUS_ACTIVE,
    balance: boolean,
    userId = undefined
  ) => {
    let where = {
      id: id,
      status: status,
      userId: userId
    };
    let include = {
      walletBalance: balance
    };
    let wallet = await this.walletRepository.findFirst(where, include);
    if (!wallet) throw new Error('Wallet not found');

    return wallet;
  };
}
export default WalletValidator;
