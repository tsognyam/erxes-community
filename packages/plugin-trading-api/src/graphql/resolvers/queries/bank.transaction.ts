import {
  checkPermission,
  requireLogin
} from '@erxes/api-utils/src/permissions';
import { IContext } from '../../../connectionResolver';
import BankTransactionService from '../../../service/wallet/bank.transaction.service';
let bankTransactionService = new BankTransactionService();
const BankTransactionQueries = {
  tradingBankTransactions: async (
    _root: any,
    { ids },
    { models, subdomain, user }: IContext
  ) => {
    return await bankTransactionService.getBankTransactionList(ids);
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
