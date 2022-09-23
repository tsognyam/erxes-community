import { IContext } from '../../../connectionResolver';
import { Prisma } from '@prisma/client';
import WalletService from '../../../service/wallet/wallet.service';
import WalletConst from '../../../constants/wallets';
import {
  checkPermission,
  requireLogin
} from '@erxes/api-utils/src/permissions';
let walletService = new WalletService();
const walletMutations = {
  tradingWalletAdd: async (
    _root: any,
    params: Prisma.WalletCreateInput,
    { user, models, subdomain }: IContext
  ) => {
    params.userId = user._id;
    if (!Object.values(WalletConst.WALLET_TYPES).includes(params.type))
      throw new Error('Wallet type must be (1=Nominal,2=User,3=Admin,4=MCSD) ');
    return await walletService.create(params);
  }
};
requireLogin(walletMutations, 'tradingWalletAdd');
export default walletMutations;
