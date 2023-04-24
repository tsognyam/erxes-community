import { IContext } from '../../../connectionResolver';
import { Prisma } from '@prisma/client';
import {
  checkPermission,
  requireLogin
} from '@erxes/api-utils/src/permissions';
import UserService from '../../../service/user/user.service';
let userService = new UserService();

const UserBankMutations = {
  tradingUserBankAdd: async (
    _root: any,
    params: any,
    { user, models, subdomain }: IContext
  ) => {
    console.log('user', user);
    console.log('subdomain', subdomain);

    return await userService.addBankAccount(user, params);
  },
  //   tradingUserBankEdit: async (
  //     _root: any,
  //     { id, ...params }: IBankEdit,
  //     { user, models, subdomain }: IContext
  //   ) => {
  //     return await userService.upda(id, params);
  //   },
  tradingUserBankRemove: async (
    _root: any,
    params: {
      id: number;
      userId: number;
    },
    { user, models, subdomain }: IContext
  ) => {
    console.log();
    return await userService.removeBankAccount(user, params);
  }
};
export default UserBankMutations;
