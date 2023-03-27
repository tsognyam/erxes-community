import { IContext } from '../../../connectionResolver';
import { Prisma } from '@prisma/client';
import {
  checkPermission,
  requireLogin
} from '@erxes/api-utils/src/permissions';
import BankTransactionService from '../../../service/wallet/bank.transaction.service';
let bankTransactionService = new BankTransactionService();
const BankTransactionMutations = {
  tradingWalletCharge: async (
    _root: any,
    params: Prisma.BankTransactionCreateInput,
    { user, models, subdomain }: IContext
  ) => {
    return await bankTransactionService.chargeV2(params, subdomain);
  },
  tradingEditBankTransactionWalletId: async (
    _root: any,
    params,
    { user, models, subdomain }: IContext
  ) => {
    return await bankTransactionService.editBankTransactionWallet(params);
  }
};
requireLogin(BankTransactionMutations, 'tradingWalletCharge');
export default BankTransactionMutations;
