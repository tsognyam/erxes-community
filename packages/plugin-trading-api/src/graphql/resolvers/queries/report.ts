import {
  checkPermission,
  requireLogin
} from '@erxes/api-utils/src/permissions';
import { IContext } from '../../../connectionResolver';
import ReportRepository from '../../../repository/report/report.repository';
let reportRepository = new ReportRepository();
const ReportQueries = {
  tradingNominalStockBalancesWithAmount: async (
    _root: any,
    params,
    { models, subdomain, user }: IContext
  ) => {
    return await reportRepository.getNominalStockBalancesWithAmount();
  }
};
export default ReportQueries;
