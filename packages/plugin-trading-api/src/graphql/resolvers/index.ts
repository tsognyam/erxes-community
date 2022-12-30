import customScalars from '@erxes/api-utils/src/customScalars';

import {
  WalletMutations,
  SystemMutations,
  BankTransactionMutations,
  OrderMutations,
  BankMutations,
  UserBankMutations,
  UserMutations,
  StockMutations
} from './mutations';
import {
  WalletQueries,
  SystemQueries,
  BankTransactionQueries,
  OrderQueries,
  BankQueries,
  UserBankQueries,
  UserQueries,
  StockQueries,
  UserMcsdQueries
} from './queries';

const resolvers: any = async serviceDiscovery => ({
  ...customScalars,
  Mutation: {
    ...WalletMutations,
    ...SystemMutations,
    ...BankTransactionMutations,
    ...OrderMutations,
    ...BankMutations,
    ...UserBankMutations,
    ...UserMutations,
    ...StockMutations
  },
  Query: {
    ...WalletQueries,
    ...SystemQueries,
    ...BankTransactionQueries,
    ...OrderQueries,
    ...BankQueries,
    ...UserBankQueries,
    ...UserQueries,
    ...StockQueries,
    ...UserMcsdQueries
  }
});

export default resolvers;
