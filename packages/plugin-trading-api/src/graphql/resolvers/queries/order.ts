import {
  checkPermission,
  requireLogin
} from '@erxes/api-utils/src/permissions';
import { IContext } from '../../../connectionResolver';
import OrderRepository from '../../../repository/order.repository';
import OrderService from '../../../service/order.service';
let orderRepository = new OrderRepository();
let orderService = new OrderService();
const OrderQueries = {
  tradingOrders: async (
    _root: any,
    { params }: { params: any },
    { models, subdomain, user }: IContext
  ) => {
    return await orderService.get(params);
  },
  tradingOrderDetail: async (
    _root: any,
    { id },
    { models, subdomain, user }: IContext
  ) => {
    return await orderRepository.findOne(id);
  },
  tradingOrderTypes: async (
    _root: any,
    {},
    { models, subdomain, user }: IContext
  ) => {
    return await orderRepository.getOrderTypeList();
  }
};
requireLogin(OrderQueries, 'tradingOrders');
requireLogin(OrderQueries, 'tradingOrderDetail');
export default OrderQueries;
