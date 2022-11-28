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
const typeDefs = async _serviceDiscovery => {
  return gql`
    scalar JSON
    scalar Date

    ${WalletTypes}
    ${SystemTypes}
    ${BankTransactionTypes}
    ${OrderTypes}
    ${BankTypes}
    
    extend type Query {
      ${WalletQueries}
      ${SystemQueries}
      ${BankTransactionQueries}
      ${OrderQueries}
      ${BankQueries}
    }
    
    extend type Mutation {
      ${WalletMutations}
      ${SystemMutations}
      ${BankTransactionMutations}
      ${OrderMutations}
      ${BankMutations}
    }
  `;
};

export default typeDefs;
