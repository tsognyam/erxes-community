import {
  checkPermission,
  requireLogin
} from '@erxes/api-utils/src/permissions';
import { IContext } from '../../../connectionResolver';
import OrderRepository from '../../../repository/order.repository';
import OrderService from '../../../service/order.service';
import { getUsers } from '../../../models/utils';
let orderRepository = new OrderRepository();
let orderService = new OrderService();
const OrderQueries = {
  tradingOrders: async (
    _root: any,
    { page, perPage, status, stockcode, txntype, sortDirection, sortField },
    { models, subdomain, user }: IContext
  ) => {
    let orderBy: any = undefined;
    if (sortField != undefined) {
      if (sortField == 'stockcode')
        orderBy = {
          stock: {
            symbol: sortDirection == '-1' ? 'desc' : 'asc'
          }
        };
      else
        orderBy = {
          [sortField]: sortDirection == '-1' ? 'desc' : 'asc'
        };
    }
    console.log('orderBy=', orderBy);
    let params = {
      skip: (page - 1) * perPage,
      take: perPage,
      status,
      stockcode,
      txntype,
      orderBy
    };
    let orderList = await orderService.get(params);
    let userIds = orderList.values?.map(function(obj: any) {
      return obj.userId;
    });
    let uniqUserIds = [...new Set(userIds)];
    let query = {
      query: {
        _id: { $in: uniqUserIds }
      }
    };
    let users = await getUsers(query,subdomain);
    let orderUser: any;
    orderList.values?.forEach((el: any) => {
      orderUser = users.find((x: any) => x._id == el.userId);
      if (orderUser != undefined && orderUser.details != undefined) {
        el.user = user.details;
      }
    });
    return orderList;
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
