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
    let updatedParams = {
      ...params,
      skip: params.page - 1 * params.perPage,
      take: params.perPage
    };
    return await userService.getFullInfo(updatedParams);
    // return await userService.getUser(subdomain, params.prefix);
  }
};
// requireLogin(UserMcsdQueries, 'tradingUserByPrefix');
export default UserMcsdQueries;
