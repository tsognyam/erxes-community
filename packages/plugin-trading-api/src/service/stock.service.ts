import OrderRepository from '../repository/order.repository';
import StockRepository from '../repository/stock.repository';
import StockTransactionRepository from '../repository/wallet/stock.transaction.repository';
import Helper from '../middleware/helper.service';
import StockValidator from './validator/stock.validator';
import { ErrorCode, CustomException } from '../exception/error-code';
import { CurrencyConst } from '../constants/wallet';
import moment = require('moment');
import CustFeeService from './custfee.service';
import CalendarService from './calendar.service';
import MarketService from './market.service';
class StockService {
  private stockValidator: StockValidator;
  private stockRepository: StockRepository;
  private stockTransactionRepository: StockTransactionRepository;
  private orderRepository: OrderRepository;
  private custFeeService: CustFeeService;
  private calendarService: CalendarService;
  private marketService: MarketService;
  constructor() {
    this.stockValidator = new StockValidator();
    this.stockRepository = new StockRepository();
    this.stockTransactionRepository = new StockTransactionRepository();
    this.orderRepository = new OrderRepository();
    this.custFeeService = new CustFeeService();
    this.calendarService = new CalendarService();
    this.marketService = new MarketService();
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
      let marketdata = await this.marketService.getMarketByStock(
        listIds,
        new Date()
      );
      // let marketdata: any = [];

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
        values: mse_market
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
    console.log('stock', stock);
    stock.startdate = new Date(stock.startdate);
    stock.enddate = new Date(stock.enddate);
    if (
      stock.order_begindate != undefined &&
      stock.order_enddate != undefined
    ) {
      stock.order_begindate = new Date(stock.order_begindate);
      stock.order_enddate = new Date(stock.order_enddate);
    }

    return await this.stockRepository.create(stock);
  };
  calculateBond = async params => {
    let multiplier = 1;
    let { stock, data } = await this.stockValidator.validateBond(params);
    if (stock.currencyCode == CurrencyConst.DEFAULT) {
      multiplier = 1000;
    }
    if (stock.currencyCode == CurrencyConst.USD) {
      multiplier = 100;
    }
    if (data.price % multiplier == data.price) {
      data.price = data.price * multiplier;
    }
    let accruedDate: number = await this.findAccrueDate(
      stock.startdate,
      stock.enddate,
      stock.notiftype,
      data.orderEndDate,
      stock.lstCouponDate
    );
    let accrued = (stock.intrate / 100 / 365) * accruedDate;
    let amount = parseFloat(
      (stock.stockprice * data.cnt * parseFloat(accrued.toFixed(8))).toFixed(2)
    );
    let netAmount = parseFloat((data.price * data.cnt + amount).toFixed(2));
    let dirtyPrice = parseFloat((data.price + amount / data.cnt).toFixed(2));
    if (data.userId) {
      let custFee = await this.custFeeService.getFee(
        data.userId,
        stock.stockcode
      );
      let netFeeAmount = parseFloat(((netAmount * custFee) / 100).toFixed(2));
      let netObligation = parseFloat((netAmount - netFeeAmount).toFixed(2));
      return { amount, dirtyPrice, netAmount, netFeeAmount, netObligation };
    }
    return { amount, dirtyPrice, netAmount };
  };
  findAccrueDate = async (
    beginDate,
    endDate,
    notifType,
    orderEndDate,
    lstCouponDate
  ) => {
    let resDate = new Date();
    let addDate = 0;
    switch (notifType) {
      case 1:
        addDate = 1;
        break;
      case 2:
        addDate = 3;
        break;
      case 3:
        addDate = 6;
        break;
      case 4:
        addDate = 12;
        break;
      case 5:
        {
          var a = moment(beginDate);
          var b = moment(endDate);
          addDate = b.diff(a, 'months');
          // console.log('addDate',addDate)
          // beginDate = endDate;
        }
        break;
      default:
        break;
    }
    // while (beginDate < resDate && beginDate < endDate) {
    //   beginDate.setMonth(beginDate.getMonth() + addDate);
    // }
    // beginDate.setMonth(beginDate.getMonth() - addDate);

    lstCouponDate.setHours(0, 0, 0, 0);
    orderEndDate.setHours(0, 0, 0, 0);
    console.log('orderEndDate.getDay()', orderEndDate.getDay());
    let settleDate = new Date(orderEndDate);
    let oEndDate = new Date(orderEndDate);
    settleDate.setDate(oEndDate.getDate() + 2); //settlement date added
    console.log(oEndDate.getDate());
    if (settleDate.getDay() == 6 || settleDate.getDay() == 0) {
      settleDate.setDate(settleDate.getDate() + 2);
    }
    console.log('orderEndDate settleDate', oEndDate, settleDate);
    let d1 = new Date(new Date(oEndDate).setHours(23, 59, 59, 0));
    let d2 = new Date(new Date(settleDate).setHours(23, 59, 59, 0));
    let addDay = await this.calendarService.dateBetween({
      fullDate: {
        gte: d1,
        lte: d2
      }
    });
    console.log('addDay.total', addDay.total);
    oEndDate.setDate(oEndDate.getDate() + addDay.total); //vacation days added
    oEndDate.setDate(oEndDate.getDate() + 2); //settlement date added
    // if(orderEndDate.getDay() == 4 || orderEndDate.getDay() == 5){
    //   orderEndDate.setDate(orderEndDate.getDate() + 2)
    // }
    if (oEndDate.getDay() == 6 || oEndDate.getDay() == 0) {
      oEndDate.setDate(oEndDate.getDate() + 2);
    }
    console.log('diff dates', lstCouponDate, oEndDate);
    var a = moment(lstCouponDate);
    // var b = moment(resDate);
    var b = moment(oEndDate);
    let diff = b.diff(a, 'days');

    if (diff > 30 * addDate) {
      CustomException(ErrorCode.NotQualifyDataException);
    }

    console.log('diff', diff);
    // console.log('diff2', diff)
    return diff;
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
