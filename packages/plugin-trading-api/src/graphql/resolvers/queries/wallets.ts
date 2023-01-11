import {
  checkPermission,
  requireLogin
} from '@erxes/api-utils/src/permissions';
import { IContext } from '../../../connectionResolver';
import WalletService from '../../../service/wallet/wallet.service';
let walletService = new WalletService();
const WalletQueries = {
  tradingWallets: async (
    _root: any,
    { type, status, walletIds },
    { models, subdomain, user }: IContext
  ) => {
    return await walletService.getWalletList(
      subdomain,
      type,
      status,
      walletIds
    );
  },
  tradingUserWallets: async (
    _root: any,
    { userId, currencyCode },
    { models, subdomain, user }: IContext
  ) => {
    return await walletService.getWalletWithUser({ userId, currencyCode });
  }
};
requireLogin(WalletQueries, 'tradingWallets');
export default WalletQueries;
