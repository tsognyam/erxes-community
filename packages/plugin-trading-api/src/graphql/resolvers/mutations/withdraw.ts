import { IContext } from '../../../connectionResolver';
import { Prisma } from '@prisma/client';
import {
  checkPermission,
  requireLogin
} from '@erxes/api-utils/src/permissions';
import WithdrawService from '../../../service/wallet/withdraw.service';
let withdraw = new WithdrawService();
const WithdrawMutations = {
  tradingWithdrawCreate: async (
    _root: any,
    params: any,
    { user, models, subdomain }: IContext
  ) => {
    // if (params.userId == null || params.userId == undefined)
    // params.userId = user._id;
    return await withdraw.requestWithdraw(params);
  },

  tradingWithdrawCancel: async (
    _root: any,
    params: any,
    { user, models, subdomain }: IContext
  ) => {
    // if (params.userId == null || params.userId == undefined)
    // params.userId = user._id;
    return await withdraw.cancelWithdraw(params);
  },
  tradingWithdrawConfirm: async (
    _root: any,
    params: any,
    { user, models, subdomain }: IContext
  ) => {
    // if (params.userId == null || params.userId == undefined)
    // params.userId = user._id;
    return await withdraw.confirmWithdraw(params);
  }
};
// requireLogin(UserMutations, 'tradingUserCreateAccount');
// requireLogin(UserMutations, 'tradingUserAdditionalInfo');
export default WithdrawMutations;
