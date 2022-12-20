import { IContext } from '../../../connectionResolver';
import { Prisma } from '@prisma/client';
import {
  checkPermission,
  requireLogin
} from '@erxes/api-utils/src/permissions';
import StockService from '../../../service/stock.service';
import { CustomException, ErrorCode } from '../../../exception/error-code';
let stockService = new StockService();
const StockMutations = {
  tradingStockAdd: async (
    _root: any,
    params: Prisma.OrderCreateInput,
    { user, models, subdomain }: IContext
  ) => {
    if (params.userId == null || params.userId == undefined) {
      if (user != null) params.userId = user._id;
      else CustomException(ErrorCode.UserNotFoundException);
    }
    return await stockService.createStock(subdomain, params);
  },
  tradingStockEdit: async (
    _root: any,
    params: any,
    { user, models, subdomain }: IContext
  ) => {
    return await stockService.updateStock(subdomain, params);
  },
  tradingStockRemove: async (
    _root: any,
    params: any,
    { user, models, subdomain }: IContext
  ) => {
    return await stockService.deleteStock(params);
  }
};
//requireLogin(walletMutations, 'tradingWalletAdd');
export default StockMutations;
