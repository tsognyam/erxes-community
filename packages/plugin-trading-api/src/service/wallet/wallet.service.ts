import { prisma } from '../../configs';
import { IWallet } from '../../models/definitions/sql/wallet';
import { WalletRepository } from '../../repository/wallet/wallet.repository';
import { WalletNumberService } from './walletNumber.service';
import WalletConst from '../../constants/wallets';
class WalletService {
  private walletNumberService: WalletNumberService;
  private walletRepository: WalletRepository;
  constructor() {
    this.walletNumberService = new WalletNumberService();
    this.walletRepository = new WalletRepository();
  }

  create = async (params: IWallet) => {
    params.status = WalletConst.STATUS_ACTIVE;
    let walletNumber = await this.walletNumberService.generate();
    let wallet = {
      name: params.name,
      currencyCode: params.currencyCode,
      userId: params.userId,
      status: params.status,
      type: WalletConst.WALLET_TYPES.NOMINAL,
      walletBalance: {
        create: {
          balance: 0,
          holdBalance: 0
        }
      },
      walletNumber: walletNumber.number,
      walletNumberId: walletNumber.id
    };
    return await this.walletRepository.create(wallet);
  };
}
export default WalletService;
