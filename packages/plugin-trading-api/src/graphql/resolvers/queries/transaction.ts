import {
  checkPermission,
  requireLogin
} from '@erxes/api-utils/src/permissions';
import { IContext } from '../../../connectionResolver';
import TransactionService from '../../../service/wallet/transaction.service';
import { getUsers } from '../../../models/utils';
import TransactionRepository from '../../../repository/wallet/transaction.repository';
let service = new TransactionService();
let repository = new TransactionRepository();
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
  },
  tradingTransactionStatement: async (
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
      userId: params.userId
    };
    let statementList = await repository.transactionStatement(updatedParams);
    return statementList;
  },
  tradingTransactionStatementSummary: async (
    _root: any,
    params,
    { models, subdomain, user }: IContext
  ) => {
    let updatedParams = {
      startDate: params.startDate,
      endDate: params.endDate,
      walletId: params.walletId,
      userId: params.userId
    };
    let statementList = await repository.transactionStatementSummary(
      updatedParams
    );
    return statementList;
  }
};
//   requireLogin(TransactionQueries, 'tradingTransactionGet');
export default TransactionQueries;
