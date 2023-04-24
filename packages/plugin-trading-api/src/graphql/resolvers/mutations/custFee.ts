import { IContext } from '../../../connectionResolver';
import { Prisma } from '@prisma/client';
import {
  checkPermission,
  requireLogin
} from '@erxes/api-utils/src/permissions';
import CustFeeService from '../../../service/custfee.service';
let service = new CustFeeService();
const CustFeeMutations = {
  tradingCustFeeUpdate: async (
    _root: any,
    params: any,
    { user, models, subdomain }: IContext
  ) => {
    // if (params.userId == null || params.userId == undefined)
    // params.userId = user._id;
    return await service.update(params);
  }
};
// requireLogin(UserMutations, 'tradingUserCreateAccount');
// requireLogin(UserMutations, 'tradingUserAdditionalInfo');
export default CustFeeMutations;
