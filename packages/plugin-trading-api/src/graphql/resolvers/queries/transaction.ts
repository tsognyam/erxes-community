import {
  checkPermission,
  requireLogin
} from '@erxes/api-utils/src/permissions';
import { IContext } from '../../../connectionResolver';
const TransactionQueries = {
  tradingNominalStatements: async (
    _root: any,
    { page, perPage, sortDirection, sortField },
    { models, subdomain, user }: IContext
  ) => {}
};
export default TransactionQueries;
