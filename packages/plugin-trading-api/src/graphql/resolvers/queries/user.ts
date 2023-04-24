import {
  checkPermission,
  requireLogin
} from '@erxes/api-utils/src/permissions';
import { IContext } from '../../../connectionResolver';
import UserService from '../../../service/user/user.service';
import UserMCSDAccountRepository from '../../../repository/user/user.mcsd.repository';
let userService = new UserService();
let userMCSDRepository = new UserMCSDAccountRepository();
const UserQueries = {
  tradingUserByPrefix123: async (
    _root: any,
    params,
    { models, subdomain, user }: IContext
  ) => {
    return await userService.getFullInfo(params);
  },
  tradingUsersTotalCount: async (
    _root: any,
    params,
    { models, subdomain, user }: IContext
  ) => {
    let count = await userMCSDRepository.getTotalCount();
    return count;
  },
  tradingUsersCountByYear: async (
    _root: any,
    params,
    { models, subdomain, user }: IContext
  ) => {
    let data = await userMCSDRepository.getUsersCountByYear(params);
    return data;
  }
};
requireLogin(UserQueries, 'tradingUserByPrefix123');
export default UserQueries;
