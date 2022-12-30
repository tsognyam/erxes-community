import { IContext } from '../../../connectionResolver';
import { Prisma } from '@prisma/client';
import {
  checkPermission,
  requireLogin
} from '@erxes/api-utils/src/permissions';
import UserService from '../../../service/user/user.service';
import { CustomException, ErrorCode } from '../../../exception/error-code';
let userService = new UserService();
const userMcsdMutations = {
  tradingUserMcsdCreate: async (
    _root: any,
    params: any,
    { user, models, subdomain }: IContext
  ) => {
    if (params.userId == null || params.userId == undefined) {
      // if (user != null) params.userId = user._id;
      // else CustomException(ErrorCode.UserNotFoundException);
    }
    return await userService.cooperateGW(params);
  }
  
};
// requireLogin(StockMutations, 'tradingWalletAdd');
// requireLogin(StockMutations, 'tradingStockEdit');
// requireLogin(StockMutations, 'tradingStockRemove');
export default userMcsdMutations;
