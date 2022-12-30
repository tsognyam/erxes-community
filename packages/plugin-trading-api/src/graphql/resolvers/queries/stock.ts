import {
  checkPermission,
  requireLogin
} from '@erxes/api-utils/src/permissions';
import { IContext } from '../../../connectionResolver';
import StockRepository from '../../../repository/stock.repository';
import StockService from '../../../service/stock.service';
let stockRepository = new StockRepository();
let stockService = new StockService();
const StockQueries = {
  tradingStocks: async (
    _root: any,
    params,
    { models, subdomain, user }: IContext
  ) => {
    console.log('params',params)
    return await stockService.getStock(params);
  },
  tradingStockList: async (
    _root: any,
    params,
    { models, subdomain, user }: IContext
  ) => {
    console.log(params);
  },
  tradingStockDetail: async (
    _root: any,
    { id },
    { models, subdomain, user }: IContext
  ) => {
    return await stockRepository.findUnique({
      id: id
    });
  }
};
export default StockQueries;
