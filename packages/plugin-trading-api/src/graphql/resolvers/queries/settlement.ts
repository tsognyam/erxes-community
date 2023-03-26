import {
  checkPermission,
  requireLogin
} from '@erxes/api-utils/src/permissions';
import { IContext } from '../../../connectionResolver';
import SettlementMSCCRepository from '../../../repository/wallet/settlement.mscc.repository';
let settlementMSCCRepository = new SettlementMSCCRepository();
const SettlementQueries = {
  tradingSettlements: async (
    _root: any,

    { startDate, endDate, page, perPage },
    { models, subdomain, user }: IContext
  ) => {
    let dateFilter = {};
    if (startDate != undefined && endDate != undefined)
      dateFilter = {
        settlementDate: {
          gte: startDate,
          lte: endDate
        }
      };
    else if (startDate != undefined)
      dateFilter = {
        settlementDate: {
          gte: startDate
        }
      };
    else if (endDate != undefined)
      dateFilter = {
        settlement: {
          lte: endDate
        }
      };
    let updatedParams = {
      skip: (page - 1) * perPage,
      take: perPage,
      ...dateFilter
    };
    let data = await settlementMSCCRepository.findAll(updatedParams);
    return data;
  }
};
export default SettlementQueries;
