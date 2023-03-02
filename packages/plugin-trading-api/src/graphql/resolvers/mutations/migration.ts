import { IContext } from '../../../connectionResolver';
import {
  attachmentInput,
  attachmentType
} from '@erxes/api-utils/src/commonTypeDefs';
import {
  checkPermission,
  requireLogin
} from '@erxes/api-utils/src/permissions';
import MigrationService from '../../../service/migration.service';
let migrationService = new MigrationService();
const MigrationMutations = {
  tradingMigration: async (
    _root: any,
    params: any,
    { user, models, subdomain }: IContext
  ) => {
    let data = {};
    if (params.type == 'walletBalance')
      data = await migrationService.migrationWalletBalance(params);
    return data;
  }
};
export default MigrationMutations;
