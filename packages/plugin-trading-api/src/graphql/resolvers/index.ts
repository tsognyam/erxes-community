import customScalars from '@erxes/api-utils/src/customScalars';

import { WalletMutations } from './mutations';
import { WalletQueries } from './queries';

const resolvers: any = async serviceDiscovery => ({
  ...customScalars,
  Mutation: {
    ...WalletMutations
  },
  Query: {
    ...WalletQueries
  }
});

export default resolvers;
