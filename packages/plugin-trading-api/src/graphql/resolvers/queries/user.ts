import {
  checkPermission,
  requireLogin
} from '@erxes/api-utils/src/permissions';
import { IContext } from '../../../connectionResolver';
import UserService from '../../../service/user/user.service';
let userService = new UserService();
const UserQueries = {
  tradingUser: async (
    _root: any,
    params,
    { models, subdomain, user }: IContext
  ) => {
    return await userService.getBank(params);
  }
};
requireLogin(UserQueries, 'tradingUser');
export default UserQueries;
