import { IContext } from '../../../connectionResolver';
import { Prisma } from '@prisma/client';
import {
  checkPermission,
  requireLogin
} from '@erxes/api-utils/src/permissions';
import StockTransactionService from '../../../service/wallet/stock.transaction.service';
let service = new StockTransactionService();
const StockTransactionsMutations = {
  tradingStockTransactionConfirm: async (
    _root: any,
    params: any,
    { user, models, subdomain }: IContext
  ) => {
    // if (params.userId == null || params.userId == undefined)
    // params.userId = user._id;
    return await service.confirmTransaction(params);
  }
};
// requireLogin(UserMutations, 'tradingUserCreateAccount');
// requireLogin(UserMutations, 'tradingUserAdditionalInfo');
export default StockTransactionsMutations;
