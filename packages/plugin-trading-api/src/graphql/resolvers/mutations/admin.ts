import { IContext } from '../../../connectionResolver';
import { Prisma } from '@prisma/client';
import {
  checkPermission,
  requireLogin
} from '@erxes/api-utils/src/permissions';
import AdminService from '../../../service/admin.service';
let adminService = new AdminService();

const AdminMutations = {
  tradingContractNote: async (
    _root: any,
    params,
    { user, models, subdomain }: IContext
  ) => {
    return await adminService.contractNote(params);
  }
};
export default AdminMutations;
