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

    { startDate, endDate, page, perPage, userId },
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
    let params: any = undefined;
    if (!!userId) {
      params = {
        userId: userId
      };
    }
    let updatedParams = {
      ...dateFilter,
      ...params
    };
    let options = {
      skip: (page - 1) * perPage,
      take: perPage
    };
    let data = await settlementMSCCRepository.findAll(
      updatedParams,
      undefined,
      options
    );
    console.log(data);
    return data;
  }
};
export default SettlementQueries;
