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

const typeDefs = async _serviceDiscovery => {
  return gql`
    scalar JSON
    scalar Date

    ${WalletTypes}
    ${SystemTypes}
    
    extend type Query {
      ${WalletQueries}
      ${SystemQueries}
    }
    
    extend type Mutation {
      ${WalletMutations}
      ${SystemMutations}
    }
  `;
};

export default typeDefs;
