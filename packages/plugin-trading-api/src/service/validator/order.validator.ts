import {
  StockConst,
  OrderTxnType,
  TxnSourceConst,
  OrderCondition
} from '../../constants/stock';
import OrderRepository from '../../repository/order.repository';
import StockRepository from '../../repository/stock.repository';
import BaseValidator from './base.validator';
import { getUser } from '../../models/utils';
import { ErrorCode, CustomException } from '../../exception/error-code';
class OrderValidator extends BaseValidator {
  private stockRepository: StockRepository;
  private orderRepository: OrderRepository;
  constructor() {
    super();
    this.stockRepository = new StockRepository();
    this.orderRepository = new OrderRepository();
  }
  validateGet = async params => {
    let { data } = this.validate(
      {
        ordertype: this._joi.number(),
        txntype: this._joi.number(),
        walletId: this._joi.number(),
        orderno: this._joi.string(),
        stockcode: this._joi.number(),
        txndate: this._joi.object({
          gt: this._joi.date(),
          gte: this._joi.date(),
          lt: this._joi.date(),
          lte: this._joi.date()
        }),
        regdate: this._joi.object({
          gt: this._joi.date(),
          gte: this._joi.date(),
          lt: this._joi.date(),
          lte: this._joi.date()
        }),
        ipo: this._joi.number(),
        cnt: this._joi.number(),
        price: this._joi.number(),
        fee: this._joi.number(),
        donedate: this._joi.object({
          gt: this._joi.date(),
          gte: this._joi.date(),
          lt: this._joi.date(),
          lte: this._joi.date()
        }),
        donecnt: this._joi.number(),
        doneprice: this._joi.number(),
        startdate: this._joi.date(),
        enddate: this._joi.date(),
        descr: this._joi.string(),
        descr2: this._joi.string(),
        txnsource: this._joi.number(),
        condid: this._joi.number(),
        userId: this._joi.string(),
        brchno: this._joi.string(),
        status: this._joi.any(),
        updatedate: this._joi.date(),
        updateUserId: this._joi.string(),
        ostatus: this._joi.number(),
        tradecode: this._joi.string(),
        yield: this._joi.number(),
        msgid: this._joi.number(),
        ipaddress: this._joi.string(),
        filename: this._joi.string(),
        mseexecutionid: this._joi.string(),
        mseorderid: this._joi.string(),
        tranorderid: this._joi.number(),
        stocktypeId: this._joi.any(),
        skip: this._joi.number(),
        take: this._joi.number(),
        detail: this._joi.any(),
        prefix: this._joi.any(),
        orderBy: this._joi.any()
      },
      params
    );
    let options: any = [];
    if (data != undefined && data.take != undefined) options.take = data.take;
    if (data != undefined && data.skip != undefined) options.skip = data.skip;
    if (data != undefined && data.orderBy != undefined)
      options.orderBy = data.orderBy;
    if (data != undefined) {
      delete data.skip;
      delete data.take;
      delete data.orderBy;
    }
    let select: any = undefined;

    // let stockType = true;
    if (data != undefined && data.stocktypeId != undefined) {
      data.stock = {
        stocktypeId: data.stocktypeId
      };
    }
    if (data != undefined && data.prefix != undefined) {
      data.user = {
        UserMCSDAccount: {
          some: {
            prefix: data.prefix
          }
        }
      };
      data.prefix = undefined;
    }
    select = {
      stock: {
        // where: {
        //     stocktypeId: data.stocktypeId
        // },
        select: {
          symbol: true,
          stocktypeId: true,
          stockname: true
        }
      },
      wallet: {
        include: {
          walletBalance: true
        }
      },
      transactionOrder: true,
      user: true
    };
    if (data != undefined) {
      delete data.detail;
      delete data.stocktypeId;
      delete data.groupBy;
    }
    let order = await this.orderRepository.findAll(data, select, options);
    return order;
  };

  validateCreatePackage = async params => {
    let { error, data } = this.validate(
      {
        status: this._joi.number().required(),
        ipo: this._joi.number().required(),
        txndate: this._joi.date().default(new Date()),
        txntype: this._joi
          .number()
          .allow(OrderTxnType.Buy, OrderTxnType.Sell)
          .default(OrderTxnType.Buy),
        stockcode: this._joi.number().required(),
        price: this._joi.number().required(),
        cnt: this._joi.number().default(1),

        fee: this._joi.number().required(),
        txnsource: this._joi
          .number()
          .required()
          .allow(TxnSourceConst.Self, TxnSourceConst.Broker),
        userId: this._joi.number().required()
      },
      params
    );
    let stockdata = await this.stockRepository.getByStockcode(data.stockcode);
    if (!stockdata) CustomException(ErrorCode.StockNotFoundException);
    await this.checkUser(data.userId);
    return data;
  };

  validateCreateIPO = async params => {
    let { error, data } = this.validate(
      {
        status: this._joi.number().required(),
        ipo: this._joi.number().required(),
        stockcode: this._joi.number().required(),
        txndate: this._joi.date().default(new Date()),
        cnt: this._joi.number().required(),
        price: this._joi.number().required(),
        fee: this._joi.number().required(),
        startdate: this._joi.date().required(),
        enddate: this._joi.date().required(),
        ordertype: this._joi.number(),
        txntype: this._joi.number().allow(OrderTxnType.Buy),
        condid: this._joi.number().allow(OrderCondition.Day),
        originalCnt: this._joi.number(),
        descr: this._joi.string().required(),
        descr2: this._joi.string().required(),
        txnsource: this._joi
          .number()
          .required()
          .allow(TxnSourceConst.Self, TxnSourceConst.Broker),
        userId: this._joi.number().required()
      },
      params
    );
    let stockdata = await this.stockRepository.getByStockcode(data.stockcode);
    if (!stockdata) CustomException(ErrorCode.StockNotFoundException);
    await this.checkUser(data.userId);
    return data;
  };
  validateCreateSO = async params => {
    let schema: any = {
      ordertype: this._joi
        .number()
        .required()
        .valid(OrderTxnType.Buy, OrderTxnType.Sell),
      txntype: this._joi.number().required(),
      walletId: this._joi.number().required(),
      orderno: this._joi.string(),
      ipo: this._joi.number(),
      status: this._joi.number(),
      stockcode: this._joi.number().required(),
      txndate: this._joi.date().default(new Date()),
      regdate: this._joi.date().default(new Date()),
      cnt: this._joi
        .number()
        .required()
        .greater(0),

      fee: this._joi.number().required(),
      donedate: this._joi.date(),
      donecnt: this._joi.number(),
      doneprice: this._joi.number(),

      descr: this._joi.string(),
      descr2: this._joi.string(),
      txnsource: this._joi
        .number()
        .required()
        .valid(TxnSourceConst.Self, TxnSourceConst.Broker),
      userId: this._joi.string().required(),
      brchno: this._joi.string(),
      updatedate: this._joi.date(),
      updateUserId: this._joi.number(),
      ostatus: this._joi.number(),
      tradecode: this._joi.string(),
      yield: this._joi.number(),
      msgid: this._joi.number(),
      ipaddress: this._joi.string(),
      filename: this._joi.string(),
      mseexecutionid: this._joi.string(),
      mseorderid: this._joi.string(),
      tranorderid: this._joi.number()
    };
    if (params.ordertype == 2) {
      schema.price = this._joi
        .number()
        .positive()
        .greater(0)
        .required();
      schema.condid = this._joi
        .number()
        .valid(OrderCondition.Day, OrderCondition.GTC, OrderCondition.GTD)
        .required();
      schema.startdate = this._joi.date().default(new Date());
      schema.enddate = this._joi
        .date()
        .greater(new Date(Date.now() - 3600 * 1000 * 24));
    } else {
      //stock get max price

      schema.condid = this._joi.number().default(OrderCondition.Day);
      schema.startdate = this._joi.date().default(new Date());
      schema.enddate = this._joi.date().default(new Date());
    }
    let { data } = this.validate(schema, params);
    if (data.condid == OrderCondition.Day) {
      data.enddate = new Date(Date.now() + 3600 * 1000 * 24);
    }
    let stockdata = await this.stockRepository.getByStockcode(params.stockcode);
    if (!stockdata) CustomException(ErrorCode.StockNotFoundException);

    if (data.ordertype == 1) {
      //let marketStock = await getMarketByStock(`'${stockdata.externalid}'`, new Date());
      // if (marketStock.length == 0)
      //     CustomException(ErrorCode.CannotOrderMarketException);
      // //if market order then price is openprice + 15%
      // let marketPrice = marketStock[0].openprice;
      // if (marketStock[0].openprice == null) {
      //     marketPrice = marketStock[0].prevprice;
      // }
      // let calcPrice = parseFloat(marketPrice) + parseFloat((marketPrice * 15 / 100).toFixed(2));
      let calcPrice = 1000;
      data.price = calcPrice;
    }
    return data;
  };
  validateUpdateSO = async params => {
    let schema: any = {
      txnid: this._joi.number().required(),
      ordertype: this._joi.number().required(),
      cnt: this._joi.number().required(),
      fee: this._joi.number().required(),
      userId: this._joi.string().required()
    };
    if (params.ordertype == 2) {
      schema.price = this._joi
        .number()
        .positive()
        .greater(0)
        .required();
      // schema.condid = this._joi.number().valid(StockConst.OrderCondition.Day, StockConst.OrderCondition.GTC, StockConst.OrderCondition.GTD).required()
    } else {
      //stock get max price
      schema.condid = this._joi.number().default(OrderCondition.Day);
      schema.startdate = this._joi.date().default(new Date());
      schema.enddate = this._joi.date().default(new Date());
    }
    let { data } = this.validate(schema, params);
    //await this.checkUser(data.userId);
    if (data.ordertype == 1) {
      // let marketStock = await getMarketByStock(`'${stockdata.externalid}'`, new Date());
      // if (marketStock.length == 0)
      //     CustomException(ErrorCode.CannotOrderMarketException);
      // //if market order then price is openprice + 15%
      // let calcPrice = parseFloat(marketStock[0].openprice) + parseFloat((marketStock[0].openprice * 15 / 100).toFixed(2));
      let calcPrice = 100;
      data.price = calcPrice;
    }

    return data;
  };
  validateCancelSO = async params => {
    let { data } = this.validate(
      {
        txnid: this._joi.number().required(),
        userId: this._joi.string().required()
      },
      params
    );
    //await this.checkUser(data.userId);
    return data;
  };
  validateCancelIPO = async params => {
    let { data } = this.validate(
      {
        txnid: this._joi.number().required(),
        stockcode: this._joi.number().required(),
        userId: this._joi.string().required()
      },
      params
    );
    let stockdata = await this.stockRepository.getByStockcode(data.stockcode);
    if (!stockdata) CustomException(ErrorCode.StockNotFoundException);
    await this.checkUser(data.userId);
    return data;
  };
  validateGetIpoSystemInfo = async params => {
    let { data } = this.validate(
      {
        txnid: this._joi.number().required()
      },
      params
    );

    return data;
  };
  checkUser = async userId => {
    let user = await getUser({ _id: userId });
    if (!user) {
      CustomException(ErrorCode.UserNotFoundException);
    }
    return user;
  };
  checkOrder = async txnid => {
    let order = await this.orderRepository.findOne(txnid);

    if (!order) {
      CustomException(ErrorCode.OrderNotFoundException);
    }

    return order;
  };
  // checkOrderType = async id => {
  //   let stocktype = await this.orderRepository.getOrderType(id);
  //   if (!stocktype) {
  //     CustomException(ErrorCode.OrderTypeNotFoundException);
  //   }

  //   return stocktype;
  // };
}
export default OrderValidator;
