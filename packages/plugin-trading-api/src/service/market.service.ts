// const validator = require('../schema/market.schema');
import MarketRepository from '../repository/market.repository';
import StockValidator from './validator/stock.validator';
import { StockConst, StockTypeConst } from '../constants/stock';
import { WalletConst, CurrencyConst } from '../constants/wallet';

export default class MarketService {
  marketRepo: MarketRepository;
  stockValidator: StockValidator;
  constructor() {
    this.marketRepo = new MarketRepository();
    this.stockValidator = new StockValidator();
  }
  getOrderbook = async stockId => {
    let json;
    let multiplier = 1;
    let stock = await this.stockValidator.validateGetStockCode({
      stockcode: stockId
    });
    // stock.symbol = stock.symbol + '-O-0000';
    const buy = await this.marketRepo.getOrderbookBuy(stock.externalid);
    const sell = await this.marketRepo.getOrderbookSell(stock.externalid);

    if (stock.stocktypeId == StockTypeConst.COMPANY_BOND) {
      if (stock.currencyCode == CurrencyConst.DEFAULT) {
        multiplier = 1000;
      }
      if (stock.currencyCode == CurrencyConst.USD) {
        multiplier = 100;
      }
      for (let i = 0; i < buy.length; i++) {
        buy[i].price = buy[i].price * multiplier;
      }
      for (let i = 0; i < sell.length; i++) {
        sell[i].price = sell[i].price * multiplier;
      }
    }
    json = [
      {
        type: 0,
        data: buy
      },
      {
        type: 1,
        data: sell
      }
    ];
    return json;
  };

  getExecutedbook = async params => {
    let stock = await this.stockValidator.validateExecutedBook(params);
    const result = await this.marketRepo.getExecutedbook(
      stock.externalid,
      stock.beginDate,
      stock.endDate
    );

    return result;
  };

  getMarket = async date => {
    const result = await this.marketRepo.getMarket(date);
    return result;
  };

  getMarketByOne = async params => {
    let data = await this.stockValidator.validateExecutedBook(params);
    const result = await this.marketRepo.getMarketByOne(
      data.externalid,
      data.beginDate,
      data.endDate
    );
    return result;
  };

  getMarketByStock = async (symbol, date) => {
    const result = await this.marketRepo.getMarketByStock(symbol, date);
    return result;
  };

  getOneMarketByStock = async symbol => {
    const result = await this.marketRepo.getOneMarketByStock(symbol);
    return result;
  };
}
