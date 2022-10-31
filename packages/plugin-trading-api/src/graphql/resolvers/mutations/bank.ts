import { IContext } from '../../../connectionResolver';
import { Prisma } from '@prisma/client';
import {
  checkPermission,
  requireLogin
} from '@erxes/api-utils/src/permissions';
import BankService from '../../../service/bank.service';
let bankService = new BankService();
interface IBankEdit extends Prisma.BankUpdateInput {
  id: number;
}
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
    { id, ...params }: IBankEdit,
    { user, models, subdomain }: IContext
  ) => {
    return await bankService.update(id, params);
  },
  tradingBankRemove: async (
    _root: any,
    { id }: { id: number },
    { user, models, subdomain }: IContext
  ) => {
    console.log();
    return await bankService.remove(id);
  }
};
export default BankMutations;
