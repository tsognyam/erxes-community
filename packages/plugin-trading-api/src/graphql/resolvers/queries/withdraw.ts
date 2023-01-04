import {
    checkPermission,
    requireLogin
  } from '@erxes/api-utils/src/permissions';
  import { IContext } from '../../../connectionResolver';
  import UserService from '../../../service/user/user.service';
import WithdrawService from '../../../service/wallet/withdraw.service';
  let withdrawService = new WithdrawService();
  const tradingWithdrawQueries = {
    tradingWithdrawGet: async (
      _root: any,
      params,
      { models, subdomain, user }: IContext
    ) => {
      return await withdrawService.getWithdrawList(params);
    }
  };
  requireLogin(tradingWithdrawQueries, 'tradingWithdrawGet');
  export default tradingWithdrawQueries;
  