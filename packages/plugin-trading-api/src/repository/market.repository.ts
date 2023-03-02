import Helper from '../middleware/helper.service';
import BaseRepository from './base.repository';
import db from '../cassandra';

export default class MarketRepository extends BaseRepository {
  constructor() {
    super('stock');
  }
  executeQuery = async query => {
    let states = db.getState();
    let connections = states.getConnectedHosts();
    if (connections.length == 0) {
      console.log('Trying cassandra connection...');
      let connection = await db.connect();
      console.log('connection', connection);
    }
  };
  getOrderbookBuy = async symbol => {
    const query =
      'select type, price, volume, symbol from trading.mse_orderbook where symbol = ? and type = 0 order by price desc';
    const params = [symbol];
    await this.executeQuery(query);
    let res = await db.execute(query, params, { prepare: true });
    return res.rows;
  };

  getOrderbookSell = async symbol => {
    const query =
      'select type, price, volume, symbol from trading.mse_orderbook where symbol = ? and type = 1 order by price asc';
    const params = [symbol];

    // Set the prepare flag in the query options
    let res = await db.execute(query, params, { prepare: true });
    return res.rows;
  };

  getExecutedbook = async (symbol, beginDate, endDate) => {
    const query =
      'select * from trading.mse_last where symbol = ? and regdate > ? and regdate < ? order by regdate desc';
    const params = [symbol, beginDate, endDate];
    console.log(params);
    // Set the prepare flag in the query options
    let res = await db.execute(query, params, { prepare: true });
    return res.rows;
  };

  getMarket = async date => {
    date = Helper.dateToString(date, true);
    const query =
      'select openprice, minprice, maxprice, lastprice, closeprice, prevprice, buyprice, buyvol, sellprice, sellvol, totalamount, trades, volume, vwap, symbol from trading.mse_market where regdate > maxTimeuuid(?) allow filtering';
    // let date = '2022-02-01';
    const params = [date];

    // Set the prepare flag in the query options
    let res = await db.execute(query, params, { prepare: true });
    return res.rows;
  };

  getMarketByOne = async (symbol, beginDate, endDate) => {
    const query =
      'select symbol, txndate, openprice, maxprice, minprice, closeprice from trading.mse_market where symbol = ? and openprice > 0 and regdate >= maxTimeuuid(?) and regdate <= maxTimeuuid(?) allow filtering; ';
    // let date = '2022-02-01';
    const params = [symbol, beginDate, endDate];

    // Set the prepare flag in the query options
    let res = await db.execute(query, params, { prepare: true });
    return res.rows;
  };

  getMarketByStock = async (symbol, date) => {
    date = Helper.dateToString(date, true);
    // const query = `select openprice, minprice, maxprice, lastprice, closeprice, prevprice, buyprice, buyvol, sellprice, sellvol, totalamount, trades, volume, vwap, symbol from trading.mse_market where symbol in (${symbol}) and regdate > maxTimeuuid(?) limit 1`;
    const query = `select openprice, minprice, maxprice, lastprice, closeprice, prevprice, buyprice, buyvol, sellprice, sellvol, totalamount, trades, volume, vwap, symbol, txndate from trading.mse_market where symbol in (${symbol}) group by symbol`;
    // let date = '2022-02-01';
    // const params = [date];

    // Set the prepare flag in the query options
    let res = await db.execute(query, { prepare: true });
    return res.rows;
  };

  getOneMarketByStock = async symbol => {
    const query = `select openprice, minprice, maxprice, lastprice, closeprice, prevprice, buyprice, buyvol, sellprice, sellvol, totalamount, trades, volume, vwap, symbol from trading.mse_market where symbol = ? order by regdate desc limit 1`;
    // let date = '2022-02-01';
    const params = [symbol];

    // Set the prepare flag in the query options
    let res = await db.execute(query, params, { prepare: true });
    return res.rows;
  };
}
