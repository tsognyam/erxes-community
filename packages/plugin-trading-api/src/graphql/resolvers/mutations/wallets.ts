import { IContext } from '../../../connectionResolver';
import { IWallet } from '../../../models/definitions/sql/wallet';
import { prisma } from '../../../configs';
import WalletConst from '../../../constants/wallets';
const walletMutations = {
  walletAdd: async (
    _root: any,
    params: IWallet,
    { user, models, subdomain }: IContext
  ) => {
    console.log(params);
    params.userId = user._id;
    params.type = WalletConst.WALLET_TYPES.NOMINAL;
    params.status = WalletConst.STATUS_ACTIVE;
    return await prisma.wallet.create(params);
  }
};
export default walletMutations;
