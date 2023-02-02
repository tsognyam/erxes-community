import {
  checkPermission,
  requireLogin
} from '@erxes/api-utils/src/permissions';
import { IContext } from '../../../connectionResolver';
import OrderRepository from '../../../repository/order.repository';
import OrderService from '../../../service/order.service';
import { getUsers, getSystemUsers } from '../../../models/utils';
let orderRepository = new OrderRepository();
let orderService = new OrderService();
const OrderQueries = {
  tradingOrders: async (
    _root: any,
    {
      page,
      perPage,
      status,
      stockcode,
      txntype,
      sortDirection,
      sortField,
      startDate,
      endDate,
      userId
    },
    { models, subdomain, user }: IContext
  ) => {
    let orderBy: any = undefined;
    if (sortField != undefined) {
      if (sortField == 'stockcode')
        orderBy = {
          stock: {
            symbol: sortDirection == '-1' ? 'asc' : 'desc'
          }
        };
      else
        orderBy = {
          [sortField]: sortDirection == '-1' ? 'asc' : 'desc'
        };
    } else
      orderBy = {
        regdate: 'desc'
      };
    let dateFilter = {};
    if (startDate != undefined && endDate != undefined)
      dateFilter = {
        txndate: {
          gte: startDate,
          lte: endDate
        }
      };
    else if (startDate != undefined)
      dateFilter = {
        txndate: {
          gte: startDate
        }
      };
    else if (endDate != undefined)
      dateFilter = {
        txndate: {
          lte: endDate
        }
      };
    let params = {
      skip: (page - 1) * perPage,
      take: perPage,
      status,
      stockcode,
      txntype,
      orderBy,
      userId,
      ...dateFilter
    };
    let orderList = await orderService.get(params);
    let userIds = orderList.values?.map(function(obj: any) {
      return obj.userId;
    });
    let systemUserIds = orderList.values
      ?.filter(order => order.createdUserId != undefined)
      .map(function(obj: any) {
        return obj.createdUserId;
      });
    let uniqUserIds = [...new Set(userIds)];
    let query = {
      _id: { $in: uniqUserIds }
    };
    let users = await getUsers(query, subdomain);
    let sysUsers = await getSystemUsers(
      {
        query: {
          _id: { $in: systemUserIds }
        }
      },
      subdomain
    );
    let orderUser: any;
    let sysUser: any;
    orderList.values?.forEach((el: any) => {
      orderUser = users.find((x: any) => x._id == el.userId);
      sysUser = sysUsers.find((x: any) => x._id == el.createdUserId);
      if (orderUser != undefined) {
        el.user.details = orderUser;
      }
      if (sysUser != undefined) {
        el.createdUserDetails = sysUser;
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
  }
};
requireLogin(OrderQueries, 'tradingOrders');
requireLogin(OrderQueries, 'tradingOrderDetail');
export default OrderQueries;
