import { IContext } from '../../../connectionResolver';
import { IWallet } from '../../../models/definitions/sql/wallet';
import WalletService from '../../../service/wallet/wallet.service';
let walletService = new WalletService();
const walletMutations = {
  walletAdd: async (
    _root: any,
    params: IWallet,
    { user, models, subdomain }: IContext
  ) => {
    params.userId = user._id;
    return await walletService.create(params);
  }
};
export default walletMutations;
