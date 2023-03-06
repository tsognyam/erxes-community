import { Router } from 'express';
import { graphqlPubsub } from '../configs';
const router = Router();

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
  console.log('req.stockMarketChanged', req.body);
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
  console.log('req.orderBookChanged', req.body);
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

export default router;
