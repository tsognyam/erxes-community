import ExchangeRepository from '../../repository/exchange.repository';
import StockRepository from '../../repository/stock.repository';
import StockTypeRepository from '../../repository/stocktype.repository';
import BaseValidator from './base.validator';
import WalletValidator from './wallet/wallet.validator';
import {
  StockConst,
  IpoType,
  StockExchange,
  StockTypeConst
} from '../../constants/stock';
import { defaultCurrencies, defaultCurrency } from '../../models/utils';
import { ErrorCode, CustomException } from '../../exception/error-code';
class StockValidator extends BaseValidator {
  private walletValidator: WalletValidator = new WalletValidator();
  private stockTypeRepository: StockTypeRepository = new StockTypeRepository();
  private exchangeRepository: ExchangeRepository = new ExchangeRepository();
  private stockRepository: StockRepository = new StockRepository();
  validateGetStockCode = async params => {
    var { error, data } = this.validate(
      {
        stockcode: this._joi.number().required()
      },
      params
    );

    let stock = await this.checkStock(data.stockcode);
    if (!stock) {
      CustomException(ErrorCode.StockNotFoundException);
    }
    return stock;
  };
  validateExecutedBook = async params => {
    var { error, data } = this.validate(
      {
        stockcode: this._joi.number().required(),
        beginDate: this._joi
          .string()
          .required()
          .pattern(new RegExp(/20\d\d-(0|1)\d-(0|1|2|3)\d \d{2}:\d{2}:\d{2}/)),
        endDate: this._joi
          .string()
          .required()
          .pattern(new RegExp(/20\d\d-(0|1)\d-(0|1|2|3)\d \d{2}:\d{2}:\d{2}/))
      },
      params
    );

    let stock = await this.checkStock(data.stockcode);
    if (!stock) {
      CustomException(ErrorCode.StockNotFoundException);
    }
    data.externalid = stock.externalid;
    return data;
  };
  validateGet = async params => {
    var { error, data } = this.validate(
      {
        userId: this._joi.number(),
        stockname: this._joi.any(),
        favourite: this._joi.boolean(),
        stockcode: this._joi.number(),
        symbol: this._joi.any(),
        status: this._joi.string(),
        stocktypeId: this._joi.number().allow(...StockTypeConst.getTypes()),
        ipo: this._joi.number().allow(StockConst.IPO, StockConst.SO),
        skip: this._joi.number(),
        take: this._joi.number(),
        detail: this._joi.boolean(),
        orderBy: this._joi.any()
      },
      params
    );

    return data;
  };
  validateUpdate = async (subdomain: string, params) => {
    let currencies = await defaultCurrencies(subdomain);
    var { error, data } = this.validate(
      {
        id: this._joi.number().required(),
        stockcode: this._joi.number(),
        symbol: this._joi
          .string()
          .min(3)
          .max(10),
        stocktypeId: this._joi.number().allow(...StockTypeConst.getTypes()),
        stockname: this._joi
          .string()
          .min(3)
          .max(30),
        stockprice: this._joi.number(),
        minprice: this._joi.number(),
        maxprice: this._joi.number(),
        openprice: this._joi.number(),
        closeprice: this._joi.number(),
        startdate: this._joi.date(),
        enddate: this._joi.date().greater(this._joi.ref('startdate')),
        intrate: this._joi.number(),
        userId: this._joi.number(),
        brchno: this._joi.string().allow(''),
        status: this._joi.string(),
        no: this._joi.string(),
        cnt: this._joi.number(),
        boardname: this._joi.string(),
        inducode: this._joi.string().allow(''),
        lsttxndate: this._joi.date(),
        ipo: this._joi.number().allow(StockConst.IPO, StockConst.SO),
        intrate2: this._joi.number(),
        externalid: this._joi.string().allow(''),
        paytype: this._joi.string().allow(''),
        multiplier: this._joi.number().allow(''),
        externalid2: this._joi.string().allow(''),
        order_begindate: this._joi.date(),
        order_enddate: this._joi.date(),
        notiftype: this._joi.number().allow(''),
        stockfee: this._joi.number(),
        exchangeid: this._joi.number(),
        ipotype: this._joi
          .number()
          .allow(IpoType.FIXED_PRICE, IpoType.BOOK_OFFERING),
        ipoexecution: this._joi
          .number()
          .max(100)
          .min(0),
        image: this._joi.string(),
        url: this._joi.string(),
        currencyCode: this._joi.string().allow(...currencies)
      },
      params
    );

    let stock = await this.stockRepository.findById(data.id);
    if (!stock) {
      CustomException(ErrorCode.StockNotFoundException);
    }
    if (data.startdate) stock.startdate = new Date(data.startdate);
    if (data.enddate) stock.enddate = new Date(data.enddate);
    if (data.order_begindate)
      stock.order_begindate = new Date(data.order_begindate);
    if (data.order_enddate) stock.order_enddate = new Date(data.order_enddate);

    return data;
  };
  validateCreate = async (subdomain: string, params: any) => {
    let currencies = await defaultCurrencies(subdomain);
    var { error, data } = this.validate(
      {
        stockcode: this._joi.number().required(),
        symbol: this._joi.string().required(),
        stocktypeId: this._joi
          .number()
          .allow(...StockTypeConst.getTypes())
          .required(),
        stockname: this._joi.string().required(),
        stockprice: this._joi.number().required(),
        minprice: this._joi.number(),
        maxprice: this._joi.number(),
        openprice: this._joi.number(),
        closeprice: this._joi.number(),
        startdate: this._joi.date().required(),
        enddate: this._joi
          .date()
          .greater(this._joi.ref('startdate'))
          .required(),
        intrate: this._joi
          .number()
          .min(0)
          .max(100),
        userId: this._joi.string(),
        brchno: this._joi.string().allow(''),
        no: this._joi.string(),
        cnt: this._joi.number(),
        boardname: this._joi.string(),
        inducode: this._joi.string().allow(''),
        lsttxndate: this._joi.date(),
        ipo: this._joi
          .number()
          .required()
          .allow(StockConst.IPO, StockConst.SO),
        intrate2: this._joi.number(),
        externalid: this._joi.string().allow(''),
        paytype: this._joi.string().allow(''),
        multiplier: this._joi.number().allow(''),
        externalid2: this._joi.string().allow(''),
        order_begindate: this._joi.date(),
        order_enddate: this._joi.date(),
        notiftype: this._joi.number().allow(''),
        stockfee: this._joi.number(),
        exchangeid: this._joi
          .number()
          .allow(
            StockExchange.EXCHANGE_LOCAL,
            StockExchange.EXCHANGE_MSE,
            StockExchange.EXCHANGE_NYSE
          )
          .required(),
        ipotype: this._joi
          .number()
          .allow(IpoType.FIXED_PRICE, IpoType.BOOK_OFFERING),
        ipoexecution: this._joi
          .number()
          .max(100)
          .min(0),
        image: this._joi.string(),
        url: this._joi.string(),
        currencyCode: this._joi.string().allow(...currencies)
      },
      params
    );

    let stock = await this.checkStock(data.stockcode);
    if (stock) {
      CustomException(ErrorCode.StockAlreadyException);
    }
    await this.checkExchange(data.exchangeid);

    return data;
  };
  validateBond = async params => {
    var { error, data } = this.validate(
      {
        stockcode: this._joi
          .custom(this.isNumber, 'custom validation')
          .required(),
        price: this._joi.custom(this.isNumber, 'custom validation').required(),
        cnt: this._joi.custom(this.isNumber, 'custom validation').required(),
        orderEndDate: this._joi.date().required(),
        userId: this._joi.custom(this.isNumber, 'custom validation')
      },
      params
    );

    let stock = await this.checkStock(data.stockcode);
    if (!stock) {
      CustomException(ErrorCode.NotBondException);
    }
    if (
      stock.stocktypeId != StockTypeConst.COMPANY_BOND &&
      stock.stocktypeId != StockTypeConst.GOV_BOND
    ) {
      CustomException(ErrorCode.NotBondException);
    }
    if (
      stock.notiftype == null ||
      stock.startdate > stock.enddate ||
      stock.intrate == null ||
      stock.enddate < new Date() ||
      stock.startdate > stock.lstCouponDate
    ) {
      CustomException(ErrorCode.NotQualifyDataException);
    }

    return { stock, data };
  };
  checkExchange = async exchangeid => {
    var exchange = await this.exchangeRepository.findUnique({
      id: exchangeid
    });

    if (!exchange) {
      CustomException(ErrorCode.ExchangeNotFoundException);
    }

    return exchange;
  };
  checkStock = async stockcode => {
    var stock = await this.stockRepository.getByStockcode(stockcode);

    return stock;
  };
  validatePosition = async (subdomain: string, params: any) => {
    let schema = {
      stockcode: this._joi.number(),
      userId: this._joi.string().required(),
      beginDate: this._joi.date().required(),
      endDate: this._joi.date().required()
    };
    let { error, data } = this.validate(schema, params);
    let currency = await defaultCurrency(subdomain);
    let wallet = await this.walletValidator.validateGetWalletWithUser({
      userId: data.userId,
      currencyCode: currency
    });
    // console.log('wallet',wallet)
    if (wallet.length == 0) CustomException(ErrorCode.WalletNotFoundException);
    data.walletId = wallet[0].id;
    return data;
  };
}
export default StockValidator;
