import customScalars from '@erxes/api-utils/src/customScalars';

import {
  WalletMutations,
  SystemMutations,
  BankTransactionMutations
} from './mutations';
import {
  WalletQueries,
  SystemQueries,
  BankTransactionQueries
} from './queries';

const resolvers: any = async serviceDiscovery => ({
  ...customScalars,
  Mutation: {
    ...WalletMutations,
    ...SystemMutations,
    ...BankTransactionMutations
  },
  Query: {
    ...WalletQueries,
    ...SystemQueries,
    ...BankTransactionQueries
  }
});

export default resolvers;
