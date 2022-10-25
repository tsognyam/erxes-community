import { IContext } from '../../../connectionResolver';
import { Prisma } from '@prisma/client';
import {
  checkPermission,
  requireLogin
} from '@erxes/api-utils/src/permissions';
import BankService from '../../../service/bank.service';
let bankService = new BankService();
const BankMutations = {
  tradingBankAdd: async (
    _root: any,
    params: Prisma.BankCreateInput,
    { user, models, subdomain }: IContext
  ) => {
    return await bankService.create(params);
  },
  tradingBankEdit: async (
    _root: any,
    { id, params }: { id: number; params: Prisma.BankUpdateInput },
    { user, models, subdomain }: IContext
  ) => {
    return await bankService.update(id, params);
  },
  tradingBankRemove: async (
    _root: any,
    id: number,
    { user, models, subdomain }: IContext
  ) => {
    return await bankService.remove(id);
  }
};
export default BankMutations;
