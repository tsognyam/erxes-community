import {
  checkPermission,
  requireLogin
} from '@erxes/api-utils/src/permissions';
import { IContext } from '../../../connectionResolver';
import StockRepository from '../../../repository/stock.repository';
import MarketService from '../../../service/market.service';
import StockService from '../../../service/stock.service';
let stockRepository = new StockRepository();
let stockService = new StockService();
let marketService = new MarketService();
const StockQueries = {
  tradingStocks: async (
    _root: any,
    params,
    { models, subdomain, user }: IContext
  ) => {
    return await stockService.getStock(params);
  },
  tradingTop20: async (
    _root: any,
    params,
    { models, subdomain, user }: IContext
  ) => {
    return await stockService.getTop20();
  },
  tradingStockList: async (
    _root: any,
    params,
    { models, subdomain, user }: IContext
  ) => {},
  tradingStockDetail: async (
    _root: any,
    { id },
    { models, subdomain, user }: IContext
  ) => {
    return await stockRepository.findUnique({
      id: id
    });
  },
  tradingGetPosition: async (
    _root: any,
    params,
    { models, subdomain, user }: IContext
  ) => {
    return await stockService.getPosition(subdomain, params);
  },
  tradingOrderBook: async (
    _root: any,
    params,
    { models, subdomain, user }: IContext
  ) => {
    return await marketService.getOrderbook(params.stockcode);
  },
  tradingExecutedBook: async (
    _root: any,
    params,
    { models, subdomain, user }: IContext
  ) => {
    return await marketService.getExecutedbook(params);
  }
};
export default StockQueries;
