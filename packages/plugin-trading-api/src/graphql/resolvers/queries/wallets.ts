import {
  checkPermission,
  requireLogin
} from '@erxes/api-utils/src/permissions';
import { IContext } from '../../../connectionResolver';
import StockWalletService from '../../../service/wallet/stock.wallet.service';
import WalletService from '../../../service/wallet/wallet.service';
let walletService = new WalletService();
let stockWalletService = new StockWalletService();
const WalletQueries = {
  tradingWallets: async (
    _root: any,
    params,
    { models, subdomain, user }: IContext
  ) => {
    let page = params.page || 1;
    let perPage = params.perPage || 20;
    return await walletService.getWalletList(
      {
        ...params,
        skip: (page - 1) * perPage,
        take: perPage
      },
      subdomain
    );
  },
  tradingUserWallets: async (
    _root: any,
    { userId, currencyCode },
    { models, subdomain, user }: IContext
  ) => {
    return await walletService.getWalletWithUser({ userId, currencyCode });
  },
  tradingStockWallets: async (
    _root: any,
    { page, perPage, walletId, stockCode, sortField, sortDirection }: any,
    { models, subdomain, user }: IContext
  ) => {
    let orderBy: any = undefined;
    if (sortField != undefined) {
      orderBy = {
        [sortField]: sortDirection == '-1' ? 'asc' : 'desc'
      };
    }
    let params: any = {
      skip: (page - 1) * perPage,
      take: perPage,
      walletId: walletId,
      stockCode: stockCode,
      orderBy: orderBy
    };
    let list = await stockWalletService.getStockWalletList(params);
    return list;
  },
  tradingNominalWallet: async (
    _root: any,
    params: any,
    { models, subdomain, user }: IContext
  ) => {
    return await walletService.getNominalWalletBalance(params);
  }
};
requireLogin(WalletQueries, 'tradingWallets');
export default WalletQueries;
