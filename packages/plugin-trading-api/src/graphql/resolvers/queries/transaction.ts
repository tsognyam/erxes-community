import {
  checkPermission,
  requireLogin
} from '@erxes/api-utils/src/permissions';
import { IContext } from '../../../connectionResolver';
import TransactionService from '../../../service/wallet/transaction.service';
import { getUsers } from '../../../models/utils';
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
    let updatedParams = {
      skip: (params.page - 1) * params.perPage,
      take: params.perPage,
      startDate: params.startDate,
      endDate: params.endDate,
      orderBy: {
        createdAt: 'desc'
      },
      status: params.status
    };
    let dataList = await service.nominalStatement(updatedParams);
    return dataList;
  }
};
//   requireLogin(TransactionQueries, 'tradingTransactionGet');
export default TransactionQueries;
