import { IContext } from '../../../connectionResolver';
import { Prisma } from '@prisma/client';
import {
  checkPermission,
  requireLogin
} from '@erxes/api-utils/src/permissions';
import OrderService from '../../../service/order.service';
import { CustomException, ErrorCode } from '../../../exception/error-code';
let orderService = new OrderService();
const OrderMutations = {
  tradingOrderAdd: async (
    _root: any,
    params: Prisma.OrderCreateInput,
    { user, models, subdomain }: IContext
  ) => {
    if (params.userId == null || params.userId == undefined) {
      if (user != null) params.userId = user._id;
      else CustomException(ErrorCode.UserNotFoundException);
    }
    return await orderService.create(params);
  },
  tradingOrderEdit: async (
    _root: any,
    params: any,
    { user, models, subdomain }: IContext
  ) => {
    return await orderService.updateOrder(params);
  },
  tradingOrderCancel: async (
    _root: any,
    params: any,
    { user, models, subdomain }: IContext
  ) => {
    return await orderService.cancelOrder(params);
  }
};
//requireLogin(walletMutations, 'tradingWalletAdd');
export default OrderMutations;
