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
    let page = params.page || 1;
    let perPage = params.perPage || 20;
    let sortField = params.sortField || 'prefix';
    let sortDirection = params.sortDirection || '-1';
    let orderBy: any = {
      [sortField]: sortDirection == '-1' ? 'asc' : 'desc'
    };
    let updatedParams = {
      ...params,
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy
    };
    return await userService.getFullInfo(updatedParams);
    // return await userService.getUser(subdomain, params.prefix);
  }
};
// requireLogin(UserMcsdQueries, 'tradingUserByPrefix');
export default UserMcsdQueries;
