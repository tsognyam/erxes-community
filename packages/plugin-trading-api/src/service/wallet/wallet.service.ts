import { prisma } from '../../configs';
import { IWallet } from '../../models/definitions/sql/wallet';
class WalletService {
  create = async (params: IWallet) => {
    //var walletNumber = await this.#walletNumberService.generate(params.type);
    let wallet = {
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
      walletNumber: ''
    };
  };
}
