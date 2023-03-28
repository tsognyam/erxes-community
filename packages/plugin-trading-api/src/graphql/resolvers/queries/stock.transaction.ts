import {
  checkPermission,
  requireLogin
} from '@erxes/api-utils/src/permissions';
import { IContext } from '../../../connectionResolver';
import UserService from '../../../service/user/user.service';
import StockTransactionService from '../../../service/wallet/stock.transaction.service';
import StockTransactionRepository from '../../../repository/wallet/stock.transaction.repository';
let service = new StockTransactionService();
let repository = new StockTransactionRepository();
const StockTransactionQueries = {
  tradingStockTransactionGet: async (
    _root: any,
    params,
    { models, subdomain, user }: IContext
  ) => {
    return await service.statement(params);
  },
  tradingStockTransactionStatement: async (
    _root: any,
    params,
    { models, subdomain, user }: IContext
  ) => {
    return await repository.stockTransactionStatement(params);
  }
};
//   requireLogin(TransactionQueries, 'tradingTransactionGet');
export default StockTransactionQueries;
