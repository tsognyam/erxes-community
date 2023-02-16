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
  TransactionMutations
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
  ReportQueries
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
    ...CustFeeMutations
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
    ...ReportQueries
  }
});

export default resolvers;
