import customScalars from '@erxes/api-utils/src/customScalars';

import {
  WalletMutations,
  SystemMutations,
  BankTransactionMutations,
  OrderMutations,
  BankMutations,
  UserBankMutations,
  UserMutations,
  StockMutations,
  WithdrawMutations,
  StockTransactionsMutations
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
  UserMcsdQueries,
  WithdrawQueries,
  TransactionQueries,
  StockTransactionQueries
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
    ...StockMutations,
    ...WithdrawMutations,
    ...StockTransactionsMutations
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
    ...UserMcsdQueries,
    ...WithdrawQueries,
    ...TransactionQueries,
    ...StockTransactionQueries
  }
});

export default resolvers;
