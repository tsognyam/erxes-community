import {
  checkPermission,
  requireLogin
} from '@erxes/api-utils/src/permissions';
import { IContext } from '../../../connectionResolver';
import { IWallet } from '../../../models/definitions/sql/wallet';
import { prisma } from '../../../configs';
const walletQueries = {
  wallets: async (
    _root: any,
    params: IWallet,
    { models, subdomain }: IContext
  ) => {
    return await prisma.wallet.find();
  }
};
export default walletQueries;
