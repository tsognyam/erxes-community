import { IContext } from '../../../connectionResolver';
import { Prisma } from '@prisma/client';
import WalletService from '../../../service/wallet/wallet.service';
import {
  checkPermission,
  requireLogin
} from '@erxes/api-utils/src/permissions';
let walletService = new WalletService();
const WalletMutations = {
  tradingWalletAdd: async (
    _root: any,
    params: any,
    { user, models, subdomain }: IContext
  ) => {
    if (params.userId == null || params.userId == undefined) {
      if (!user) throw new Error('User not found');
      params.userId = user._id;
    }
    return await walletService.createWallet(params, subdomain);
  }
};
requireLogin(WalletMutations, 'tradingWalletAdd');
export default WalletMutations;
