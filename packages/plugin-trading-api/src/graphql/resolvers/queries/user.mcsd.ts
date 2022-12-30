import {
  checkPermission,
  requireLogin
} from '@erxes/api-utils/src/permissions';
import { IContext } from '../../../connectionResolver';
import UserService from '../../../service/user/user.service';
let userService = new UserService();
const UserMcsdQueries = {
  tradingUserByPrefix: async (
    _root: any,
    params,
    { models, subdomain, user }: IContext
  ) => {
    return await userService.getFullInfo(params);
  }
};
// requireLogin(UserMcsdQueries, 'tradingUserByPrefix');
export default UserMcsdQueries;
