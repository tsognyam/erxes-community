import { getSubdomain } from '@erxes/api-utils/src/core';
import { Router } from 'express';
import { graphqlPubsub } from '../configs';
import NotificationService from '../service/notification.service';
import UserService from '../service/user/user.service';
const router = Router();
let userService = new UserService();
let notificationService = new NotificationService();
router.post('/market', async (req, res) => {
  const {
    cnt,
    openprice,
    closeprice,
    prevprice,
    maxprice,
    minprice,
    lastprice,
    lastsize,
    symbol,
    totalamount,
    vwap,
    trades
  } = req.body;

  graphqlPubsub.publish('stockMarketChanged', {
    stockMarketChanged: {
      cnt,
      openprice,
      closeprice,
      prevprice,
      maxprice,
      minprice,
      lastprice,
      lastsize,
      symbol,
      totalamount,
      vwap,
      trades
    }
  });
  return res.json({
    data: 'Success'
  });
});

router.post('/order-book', async (req, res) => {
  const { status, symbol, data } = req.body;
  graphqlPubsub.publish('orderBookChanged', {
    orderBookChanged: {
      status,
      symbol,
      data
    }
  });
  return res.json({
    data: 'Success'
  });
});

//test subscription
router.post('/order-received', async (req, res) => {
  const order = req.body;
  console.log('order', order);
  graphqlPubsub.publish('orderReceived', {
    orderReceived: order
  });
  return res.json({
    data: 'Success'
  });
});

router.post('/test', async (req, res) => {
  const body = req.body;
  notificationService.send({
    subdomain: getSubdomain(req),
    createdUserId: body.createdUserId,
    subject: 'test subject',
    content: 'testing notification',
    action: 'asd',
    userId: [body.userId],
    data: 'asd'
  });
  return res.json({
    data: 'Success'
  });
});
export default router;
