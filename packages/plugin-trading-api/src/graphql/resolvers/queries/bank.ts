import {
  checkPermission,
  requireLogin
} from '@erxes/api-utils/src/permissions';
import { IContext } from '../../../connectionResolver';
import BankService from '../../../service/bank.service';
let bankService = new BankService();
const BankQueries = {
  tradingBanks: async (_root: any, { models, subdomain, user }: IContext) => {
    return await bankService.list();
  },
  tradingBankDetail: async (
    _root: any,
    { id },
    { models, subdomain, user }: IContext
  ) => {
    return await bankService.detail(id);
  }
};
export default BankQueries;
