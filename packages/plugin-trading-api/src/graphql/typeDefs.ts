import { gql } from 'apollo-server-express';

import {
  types as WalletTypes,
  queries as WalletQueries,
  mutations as WalletMutations
} from './schema/wallet';

import {
  types as SystemTypes,
  queries as SystemQueries,
  mutations as SystemMutations
} from './schema/systems';
import {
  types as BankTransactionTypes,
  queries as BankTransactionQueries,
  mutations as BankTransactionMutations
} from './schema/bank.transaction';
import {
  types as OrderTypes,
  queries as OrderQueries,
  mutations as OrderMutations
} from './schema/order';
import {
  types as BankTypes,
  queries as BankQueries,
  mutations as BankMutations
} from './schema/bank';

import {
  types as UserBankTypes,
  queries as UserBankQueries,
  mutations as UserBankMutations
} from './schema/userBank';

import {
  types as UserTypes,
  queries as UserQueries,
  mutations as UserMutations
} from './schema/user';

import {
  types as StockTypes,
  queries as StockQueries,
  mutations as StockMutations
} from './schema/stock';

import {
  types as UserMcsdTypes,
  queries as UserMcsdQueries
  // mutations as StockMutations
} from './schema/user.mcsd';

import {
  types as WithdrawTypes,
  queries as WithdrawQueries,
  mutations as WithdrawMutations
} from './schema/withdraw';

import {
  types as TransactionTypes,
  queries as TransactionQueries,
  mutations as TransactionMutations
} from './schema/transaction';

import {
  types as StockTransactionTypes,
  queries as StockTransactionQueries,
  mutations as StockTransactionMutations
} from './schema/stock.transaction';

import {
  types as CustFeeTypes,
  queries as CustFeeQueries,
  mutations as CustFeeMutations
} from './schema/custFee';

import {
  types as AdminTypes,
  queries as AdminQueries,
  mutations as AdminMutations
} from './schema/admin';

import {
  types as ReportTypes,
  queries as ReportQueries
} from './schema/report';
const typeDefs = async _serviceDiscovery => {
  return gql`
    scalar JSON
    scalar Date

    ${WalletTypes}
    ${SystemTypes}
    ${BankTransactionTypes}
    ${OrderTypes}
    ${BankTypes}
    ${UserBankTypes}
    ${UserTypes}
    ${StockTypes}
    ${UserMcsdTypes}
    ${WithdrawTypes}
    ${TransactionTypes}
    ${StockTransactionTypes}
    ${CustFeeTypes}
    ${AdminTypes}
    
    ${ReportTypes}
    extend type Query {
      ${WalletQueries}
      ${SystemQueries}
      ${BankTransactionQueries}
      ${OrderQueries}
      ${BankQueries}
      ${UserBankQueries}
      ${UserQueries}
      ${StockQueries}
      ${UserMcsdQueries}
      ${WithdrawQueries}
      ${TransactionQueries}
      ${StockTransactionQueries}
      ${CustFeeQueries}
      ${AdminQueries}
      ${ReportQueries}
    }
    
    extend type Mutation {
      ${WalletMutations}
      ${SystemMutations}
      ${BankTransactionMutations}
      ${OrderMutations}
      ${BankMutations}
      ${UserBankMutations}
      ${UserMutations}
      ${StockMutations}
      ${WithdrawMutations}
      ${StockTransactionMutations}
      ${CustFeeMutations}
      ${TransactionMutations}
      ${AdminMutations}
    }
  `;
};

export default typeDefs;
