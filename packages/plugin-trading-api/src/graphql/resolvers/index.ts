import customScalars from '@erxes/api-utils/src/customScalars';

import { WalletMutations, SystemMutations } from './mutations';
import { WalletQueries, SystemQueries } from './queries';

const resolvers: any = async serviceDiscovery => ({
  ...customScalars,
  Mutation: {
    ...WalletMutations,
    ...SystemMutations
  },
  Query: {
    ...WalletQueries,
    ...SystemQueries
  }
});

export default resolvers;
