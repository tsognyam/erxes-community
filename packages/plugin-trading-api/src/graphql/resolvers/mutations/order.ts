import { IContext } from '../../../connectionResolver';
import { Prisma } from '@prisma/client';
import { moduleCheckPermission } from '@erxes/api-utils/src/permissions';
import OrderService from '../../../service/order.service';
import { CustomException, ErrorCode } from '../../../exception/error-code';
import TransactionService from '../../../service/wallet/transaction.service';
import { sendLogsMessage } from '../../../messageBroker';
import { graphqlPubsub } from '../../../configs';
import { getClientPortalUser } from '../../../models/utils';
import MarketService from '../../../service/market.service';
let orderService = new OrderService();
let transactionService = new TransactionService();
let marketService = new MarketService();
const OrderMutations = {
  tradingOrderAdd: async (
    _root: any,
    params: any,
    { user, models, subdomain, cpUser }: IContext
  ) => {
    // if (params.userId == null || params.userId == undefined) {
    //   if (user != null) params.userId = user._id;
    //   else CustomException(ErrorCode.UserNotFoundException);
    // }
    if (user != null) params.createdUserId = user._id;
    if (!!cpUser) {
      let clientPortalUser = await getClientPortalUser(cpUser, subdomain);
      if (!!clientPortalUser) {
        params.userId = clientPortalUser.erxesCustomerId;
        params.createdUserId = cpUser.userId;
      }
    }
    let order = await orderService.create(params);
    return order;
  },
  tradingOrderEdit: async (
    _root: any,
    params: any,
    { user, models, subdomain, cpUser }: IContext
  ) => {
    if (user != null) params.userId = user._id;
    if (!!cpUser) {
      params.userId = cpUser.userId;
    }
    return await orderService.updateOrder(params);
  },
  tradingOrderCancel: async (
    _root: any,
    params: any,
    { user, models, subdomain, cpUser }: IContext
  ) => {
    if (user != null) params.userId = user._id;
    if (!!cpUser) {
      params.userId = cpUser.userId;
    }
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
moduleCheckPermission(OrderMutations, 'tradingOrderManagement');
export default OrderMutations;
