import {
  checkPermission,
  requireLogin
} from '@erxes/api-utils/src/permissions';
import { IContext } from '../../../connectionResolver';
import ReportService from '../../../service/report/report.service';
let reportService = new ReportService();
const ReportQueries = {
  tradingNominalStockBalancesWithAmount: async (
    _root: any,
    params,
    { models, subdomain, user }: IContext
  ) => {
    return await reportService.getNominalStockBalancesWithAmount(params);
  }
};
export default ReportQueries;
