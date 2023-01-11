import {
  checkPermission,
  requireLogin
} from '@erxes/api-utils/src/permissions';
import { IContext } from '../../../connectionResolver';
import UserService from '../../../service/user/user.service';
import StockTransactionService from '../../../service/wallet/stock.transaction.service';

let service = new StockTransactionService();
const StockTransactionQueries = {
  tradingStockTransactionGet: async (
    _root: any,
    params,
    { models, subdomain, user }: IContext
  ) => {
    return await service.statement(params);
  }
};
//   requireLogin(TransactionQueries, 'tradingTransactionGet');
export default StockTransactionQueries;
