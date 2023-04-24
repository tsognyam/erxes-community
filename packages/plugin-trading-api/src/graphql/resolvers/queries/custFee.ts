import {
  checkPermission,
  requireLogin
} from '@erxes/api-utils/src/permissions';
import { IContext } from '../../../connectionResolver';
import CustFeeService from '../../../service/custfee.service';

let service = new CustFeeService();
const CustFeeQueries = {
  tradingCustFeeByStock: async (
    _root: any,
    params,
    { models, subdomain, user }: IContext
  ) => {
    return await service.get(params);
  },
  tradingCustFeeGetList: async (
    _root: any,
    params,
    { models, subdomain, user }: IContext
  ) => {
    return await service.getList(params);
  }
};
//   requireLogin(TransactionQueries, 'tradingTransactionGet');
export default CustFeeQueries;
