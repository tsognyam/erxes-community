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
    }
  `;
};

export default typeDefs;
