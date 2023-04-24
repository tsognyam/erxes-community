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
    let updatedParams = {
      skip:
        params.page != undefined
          ? (params.page - 1) * params.perPage
          : undefined,
      take: params.perPage,
      startDate: params.startDate,
      endDate: params.endDate,
      walletId: params.walletId,
      userId: params.userId,
      stockcode: params.stockcode
    };
    return await repository.stockTransactionStatement(updatedParams);
  },
  tradingStockTransactionStatementSummary: async (
    _root: any,
    params,
    { models, subdomain, user }: IContext
  ) => {
    let updatedParams = {
      startDate: params.startDate,
      endDate: params.endDate,
      walletId: params.walletId,
      userId: params.userId,
      stockcode: params.stockcode
    };
    let statementList = await repository.stockTransactionStatementSummary(
      updatedParams
    );
    return statementList;
  }
};
//   requireLogin(TransactionQueries, 'tradingTransactionGet');
export default StockTransactionQueries;
