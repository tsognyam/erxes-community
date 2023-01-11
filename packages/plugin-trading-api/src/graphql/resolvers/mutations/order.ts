import { IContext } from '../../../connectionResolver';
import { Prisma } from '@prisma/client';
import {
  checkPermission,
  requireLogin
} from '@erxes/api-utils/src/permissions';
import OrderService from '../../../service/order.service';
import { CustomException, ErrorCode } from '../../../exception/error-code';
import TransactionService from '../../../service/wallet/transaction.service';
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
    console.log(params);
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
  },
  tradingOrderConfirm: async (
    _root: any,
    params: any,
    { user, models, subdomain }: IContext
  ) => {
    return await transactionService.reCreateTransaction(params);
  }
};
//requireLogin(walletMutations, 'tradingWalletAdd');
export default OrderMutations;
