import { IContext } from '../../../connectionResolver';
import {
  checkPermission,
  requireLogin
} from '@erxes/api-utils/src/permissions';
import TransactionService from '../../../service/wallet/transaction.service';
let service = new TransactionService();
const TransactionMutations = {
  tradingTransactionConfirm: async (
    _root: any,
    params: any,
    { user, models, subdomain }: IContext
  ) => {
    return await service.confirmTransaction(params);
  }
};
// requireLogin(UserMutations, 'tradingUserCreateAccount');
// requireLogin(UserMutations, 'tradingUserAdditionalInfo');
export default TransactionMutations;
