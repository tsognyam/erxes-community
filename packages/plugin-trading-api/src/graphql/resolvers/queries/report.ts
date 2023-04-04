import {
  checkPermission,
  requireLogin
} from '@erxes/api-utils/src/permissions';
import { IContext } from '../../../connectionResolver';
import ReportService from '../../../service/report/report.service';
import TransactionRepository from '../../../repository/wallet/transaction.repository';
let reportService = new ReportService();
let transactionRepo = new TransactionRepository();
const ReportQueries = {
  tradingNominalStockBalancesWithAmount: async (
    _root: any,
    params,
    { models, subdomain, user }: IContext
  ) => {
    return await reportService.getNominalStockBalancesWithAmount(params);
  },
  tradingStockBalancesWithAmount: async (
    _root: any,
    params,
    { models, subdomain, user }: IContext
  ) => {
    return await reportService.getStockBalancesWithAmount(params);
  },
  tradingTransactionBalancesByYear: async (
    _root: any,
    params,
    { models, subdomain, user }: IContext
  ) => {
    return await transactionRepo.transactionBalancesByYear(params);
  }
};
export default ReportQueries;
