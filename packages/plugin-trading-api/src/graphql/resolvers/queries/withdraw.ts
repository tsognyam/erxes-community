import {
  checkPermission,
  requireLogin
} from '@erxes/api-utils/src/permissions';
import { IContext } from '../../../connectionResolver';
import UserService from '../../../service/user/user.service';
import WithdrawService from '../../../service/wallet/withdraw.service';
let withdrawService = new WithdrawService();
const WithdrawQueries = {
  tradingWithdrawGet: async (
    _root: any,
    params,
    { models, subdomain, user }: IContext
  ) => {
    return await withdrawService.getWithdrawList(params);
  }
};
requireLogin(WithdrawQueries, 'tradingWithdrawGet');
export default WithdrawQueries;
