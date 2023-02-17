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
  StockTransactionsMutations,
  CustFeeMutations,
  TransactionMutations,
  AdminMutations
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
  StockTransactionQueries,
  CustFeeQueries,
  AdminQueries
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
    ...StockTransactionsMutations,
    ...TransactionMutations,
    ...CustFeeMutations,
    ...AdminMutations
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
    ...StockTransactionQueries,
    ...CustFeeQueries,
    ...AdminQueries
  }
});

export default resolvers;
