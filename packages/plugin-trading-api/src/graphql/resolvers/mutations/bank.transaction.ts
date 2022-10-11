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
    return await bankTransactionService.chargeRequest(params, subdomain);
  }
};
requireLogin(BankTransactionMutations, 'tradingWalletCharge');
checkPermission(
  BankTransactionMutations,
  'tradingWalletCharge',
  'TradingBroker'
);
export default BankTransactionMutations;
