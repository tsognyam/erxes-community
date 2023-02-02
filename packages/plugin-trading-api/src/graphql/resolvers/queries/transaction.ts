import {
  checkPermission,
  requireLogin
} from '@erxes/api-utils/src/permissions';
import { IContext } from '../../../connectionResolver';
import UserService from '../../../service/user/user.service';
import TransactionService from '../../../service/wallet/transaction.service';
let service = new TransactionService();
const TransactionQueries = {
  tradingTransactionGet: async (
    _root: any,
    params,
    { models, subdomain, user }: IContext
  ) => {
    return await service.statement(params);
  },
  tradingTransactionNominalList: async (
    _root: any,
    params,
    { models, subdomain, user }: IContext
  ) => {
    return await service.nominalStatement(params);
  }
};
//   requireLogin(TransactionQueries, 'tradingTransactionGet');
export default TransactionQueries;
