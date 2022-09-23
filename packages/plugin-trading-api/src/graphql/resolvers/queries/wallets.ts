import {
  checkPermission,
  requireLogin
} from '@erxes/api-utils/src/permissions';
import { IContext } from '../../../connectionResolver';
import WalletService from '../../../service/wallet/wallet.service';
let walletService = new WalletService();
const walletQueries = {
  tradingWallets: async (
    _root: any,
    { type, status, walletIds },
    { models, subdomain, user }: IContext
  ) => {
    return await walletService.getWalletList(type, status, walletIds);
  }
};
requireLogin(walletQueries, 'tradingWallets');
export default walletQueries;
