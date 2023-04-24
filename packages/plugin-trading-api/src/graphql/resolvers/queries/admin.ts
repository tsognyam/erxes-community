import {
  checkPermission,
  requireLogin
} from '@erxes/api-utils/src/permissions';
import { IContext } from '../../../connectionResolver';
import AdminService from '../../../service/admin.service';
let adminService = new AdminService();
const AdminQueries = {
  tradingGetContractNote: async (
    _root: any,
    params,
    { models, subdomain, user }: IContext
  ) => {
    return await adminService.getContractNote(params);
  }
};
//   requireLogin(BankQueries, 'tradingBanks');
export default AdminQueries;
