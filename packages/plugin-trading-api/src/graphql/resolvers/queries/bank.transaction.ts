import {
  checkPermission,
  requireLogin
} from '@erxes/api-utils/src/permissions';
import { IContext } from '../../../connectionResolver';
import BankTransactionService from '../../../service/wallet/bank.transaction.service';
import { getUsers } from '../../../models/utils';
let bankTransactionService = new BankTransactionService();
const BankTransactionQueries = {
  tradingBankTransactions: async (
    _root: any,
    params: any,
    { models, subdomain, user }: IContext
  ) => {
    let updatedParams = {
      skip: (params.page - 1) * params.perPage,
      take: params.perPage,
      startDate: params.startDate,
      endDate: params.endDate,
      orderBy: {
        dater: 'desc'
      },
      status: params.status
    };
    let bankTransactionList = await bankTransactionService.getBankTransactionList(
      updatedParams
    );
    return bankTransactionList;
  },
  tradingBankTransactionDetail: async (
    _root: any,
    { id },
    { models, subdomain, user }: IContext
  ) => {
    return await bankTransactionService.getBankTransaction(id);
  }
};
export default BankTransactionQueries;
