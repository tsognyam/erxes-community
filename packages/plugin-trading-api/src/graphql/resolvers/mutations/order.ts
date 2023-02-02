import { IContext } from '../../../connectionResolver';
import { Prisma } from '@prisma/client';
import {
  checkPermission,
  requireLogin
} from '@erxes/api-utils/src/permissions';
import OrderService from '../../../service/order.service';
import { CustomException, ErrorCode } from '../../../exception/error-code';
import TransactionService from '../../../service/wallet/transaction.service';
import { sendLogsMessage } from '../../../messageBroker';
let orderService = new OrderService();
let transactionService = new TransactionService();
const OrderMutations = {
  tradingOrderAdd: async (
    _root: any,
    params: any,
    { user, models, subdomain }: IContext
  ) => {
    // if (params.userId == null || params.userId == undefined) {
    //   if (user != null) params.userId = user._id;
    //   else CustomException(ErrorCode.UserNotFoundException);
    // }
    if (user != null) params.createdUserId = user._id;
    let order = await orderService.create(params);
    return order;
  },
  tradingOrderEdit: async (
    _root: any,
    params: any,
    { user, models, subdomain }: IContext
  ) => {
    if (user != null) params.userId = user._id;
    return await orderService.updateOrder(params);
  },
  tradingOrderCancel: async (
    _root: any,
    params: any,
    { user, models, subdomain }: IContext
  ) => {
    if (user != null) params.userId = user._id;
    return await orderService.cancelOrder(params);
  },
  tradingOrderConfirm: async (
    _root: any,
    params: any,
    { user, models, subdomain }: IContext
  ) => {
    return await transactionService.reCreateTransaction(params);
  }
};
requireLogin(OrderMutations, 'tradingOrderAdd');
requireLogin(OrderMutations, 'tradingOrderEdit');
requireLogin(OrderMutations, 'tradingOrderCancel');
requireLogin(OrderMutations, 'tradingOrderConfirm');
export default OrderMutations;
