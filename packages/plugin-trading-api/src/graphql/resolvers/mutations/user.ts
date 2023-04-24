import { IContext } from '../../../connectionResolver';
import { Prisma } from '@prisma/client';
import UserService from '../../../service/user/user.service';
import {
  checkPermission,
  requireLogin
} from '@erxes/api-utils/src/permissions';
let userService = new UserService();
const UserMutations = {
  tradingUserCooperate: async (
    _root: any,
    params: any,
    { user, models, subdomain }: IContext
  ) => {
    // if (params.userId == null || params.userId == undefined)
    // params.userId = user._id;
    return await userService.cooperateGW(params);
  }
};
// requireLogin(UserMutations, 'tradingUserCreateAccount');
// requireLogin(UserMutations, 'tradingUserAdditionalInfo');
export default UserMutations;
