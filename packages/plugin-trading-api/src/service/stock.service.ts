import OrderRepository from '../repository/order.repository';
import StockRepository from '../repository/stock.repository';
import StockTransactionRepository from '../repository/wallet/stock.transaction.repository';
import Helper from '../middleware/helper.service';
import StockValidator from './validator/stock.validator';
import { ErrorCode, CustomException } from '../exception/error-code';
class StockService {
  private stockValidator: StockValidator;
  private stockRepository: StockRepository;
  private stockTransactionRepository: StockTransactionRepository;
  private orderRepository: OrderRepository;
  constructor() {
    this.stockValidator = new StockValidator();
    this.stockRepository = new StockRepository();
    this.stockTransactionRepository = new StockTransactionRepository();
    this.orderRepository = new OrderRepository();
  }
  getStockCode = async params => {
    var stock = await this.stockValidator.validateGetStockCode(params);

    return stock;
  };
  getStock = async params => {
    var data = await this.stockValidator.validateGet(params);
    let options: any = [];
    options.take = data.take;
    options.skip = data.skip;
    options.orderBy = data.orderBy;
    data.skip = undefined;
    data.take = undefined;
    data.orderBy = undefined;
    let select: any = undefined;

    if (data.favourite != undefined && data.favourite == true) {
      select = {
        stockFav: {
          where: {
            userId: data.userId
          }
        }
      };
    }
    data.userId = undefined;
    data.favourite = undefined;
    let detail = data.detail;
    data.detail = undefined;

    let stock = await this.stockRepository.findAll(data, select, options);
    if (!stock) {
      CustomException(ErrorCode.StockNotFoundException);
    }

    let listIds = '';
    stock.values.forEach(element => {
      listIds += "'" + element.externalid + "'" + ',';
    });
    listIds = listIds.substring(0, listIds.length - 1);

    let mse_market: any = [];
    if (detail != undefined && detail == true) {
      //let marketdata = await getMarketByStock(listIds, new Date());
      let marketdata: any = [];

      if (marketdata.length != 0 && stock.values != 0) {
        for (let i = 0; i < stock.count; i++) {
          for (let j = 0; j < marketdata.length; j++) {
            if (stock.values[i].externalid == marketdata[j].symbol) {
              var obj = { ...stock.values[i], ...marketdata[j] };
              obj.symbol = stock.values[i].symbol;
              mse_market.push(obj);
              break;
            }
          }
        }
      } else {
        mse_market = stock.values;
      }

      return {
        total: stock.total,
        count: mse_market.length,
        data: mse_market
      };
    }
    return stock;
  };

  updateStock = async (subdomain: string, params) => {
    var stock = await this.stockValidator.validateUpdate(subdomain, params);

    return this.stockRepository.update(stock);
  };

  deleteStock = async params => {
    var stock = await this.stockValidator.validateGetStockCode(params);

    let res = await this.stockRepository.delete(stock);
    return true;
  };

  createStock = async (subdomain: string, params) => {
    var stock = await this.stockValidator.validateCreate(subdomain, params);

    stock.startdate = new Date(stock.startdate);
    stock.enddate = new Date(stock.enddate);
    if (
      stock.order_begindate != undefined &&
      stock.order_enddate != undefined
    ) {
      stock.order_begindate = new Date(stock.order_begindate);
      stock.order_enddate = new Date(stock.order_enddate);
    }

    return this.stockRepository.create(stock);
  };

  getPosition = async (subdomain: string, params) => {
    let data = await this.stockValidator.validatePosition(subdomain, params);

    let select = undefined;
    let options = [];
    // let orderList = await this._orderRepository.findAll(where, select, options);

    let orderList = await this.stockRepository._prisma.$queryRaw`
          select t.symbol, t.stockcode, t.stocktypeId, t.amount as buyamount, t.buyvolume, t.sellvolume, (t.amount/t.buyvolume) as avg, (t.buyvolume-t.sellvolume)*(t.amount/t.buyvolume) as result, externalid from (select s.symbol, s.externalid, s.stockcode, s.stocktypeId, sum(case when o.txntype = 1 then o.doneprice*o.donecnt else 0 end) as amount, sum(case when o.txntype = 1 then o.donecnt else 0 end) as buyvolume,  sum(case when o.txntype = 2 then o.donecnt else 0 end) as sellvolume from \`Order\` o left join \`Stock\` s on o.stockcode = s.stockcode left join StockBalance sb on s.stockcode = sb.stockCode and sb.walletId = o.walletId where o.userId = ${
            data.userId
          } and sb.balance > 0 and o.donedate > ${Helper.dateToString(
      data.beginDate,
      true
    )} and o.donedate < ${Helper.dateToString(
      data.endDate,
      true
    )} group by o.stockcode) as t`;
    // for (let i = 0; i < orderList.length; i++) {
    //     let market = await getOneMarketByStock(orderList[i].externalid);
    //     if (market.length != 0) {
    //         let price = market[0].closeprice || market[0].prevprice;
    //         orderList[i].gainloss = parseFloat(price * (orderList[i].buyvolume - orderList[i].sellvolume)) - parseFloat(orderList[i].result)
    //         orderList[i].rate = parseFloat(price * (orderList[i].buyvolume - orderList[i].sellvolume));
    //         orderList[i].percent = parseFloat(((price * (orderList[i].buyvolume - orderList[i].sellvolume)) - (orderList[i].result)) / orderList[i].result);
    //     }
    //     else {
    //         orderList[i].diff = 0;
    //     }
    // }

    return orderList;
  };
}
export default StockService;
