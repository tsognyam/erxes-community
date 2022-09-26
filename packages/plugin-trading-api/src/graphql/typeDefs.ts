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
const typeDefs = async _serviceDiscovery => {
  return gql`
    scalar JSON
    scalar Date

    ${WalletTypes}
    ${SystemTypes}
    ${BankTransactionTypes}
    
    extend type Query {
      ${WalletQueries}
      ${SystemQueries}
      ${BankTransactionQueries}
    }
    
    extend type Mutation {
      ${WalletMutations}
      ${SystemMutations}
      ${BankTransactionMutations}
    }
  `;
};

export default typeDefs;
