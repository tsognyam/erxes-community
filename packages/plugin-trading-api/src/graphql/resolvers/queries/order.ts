import {
  checkPermission,
  requireLogin
} from '@erxes/api-utils/src/permissions';
import { IContext } from '../../../connectionResolver';
import OrderRepository from '../../../repository/order.repository';
import OrderService from '../../../service/order.service';
let orderRepository = new OrderRepository();
const OrderQueries = {
  tradingOrders: async (
    _root: any,
    { userId, tradeDate }: { userId: string; tradeDate: Date },
    { models, subdomain, user }: IContext
  ) => {
    console.log(userId);
    return await orderRepository.getOrderList(userId, tradeDate);
  },
  tradingOrderDetail: async (
    _root: any,
    { id },
    { models, subdomain, user }: IContext
  ) => {
    return await orderRepository.findOne(id);
  }
};
export default OrderQueries;
