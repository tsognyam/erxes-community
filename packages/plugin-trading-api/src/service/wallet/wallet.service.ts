//import { IWallet } from '../../models/definitions/wallet';
import { WalletRepository } from '../../repository/wallet/wallet.repository';
import { WalletNumberService } from './walletNumber.service';
import { Prisma } from '@prisma/client';
import WalletConst from '../../constants/wallets';
class WalletService {
  private walletNumberService: WalletNumberService;
  private walletRepository: WalletRepository;
  constructor() {
    this.walletNumberService = new WalletNumberService();
    this.walletRepository = new WalletRepository();
  }
  create = async (params: Prisma.WalletCreateInput) => {
    params.status = WalletConst.STATUS_ACTIVE;
    let walletNumber = await this.walletNumberService.generate();
    let wallet = {
      name: params.name,
      currencyCode: params.currencyCode,
      userId: params.userId,
      status: params.status,
      type: params.type,
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
  edit = async (params: any) => {};
  remove = async () => {};
  getWalletList = async (
    type?: Number,
    status?: Number,
    walletIds?: Number[]
  ) => {
    let where: any = {};
    if (type != null) where.type = type;
    if (status != null) where.status = status;
    if (walletIds != null) where.id = { in: walletIds };
    let include = {
      walletNumberModel: true,
      walletBalance: true,
      stockBalances: true,
      stockTransactions: true
    };
    let wallets = await this.walletRepository.findMany(where, include);
    return wallets;
  };
}
export default WalletService;
