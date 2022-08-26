import { gql } from 'apollo-server-express';

import {
  types as WalletTypes,
  queries as WalletQueries,
  mutations as WalletMutations
} from './schema/wallet';

const typeDefs = async _serviceDiscovery => {
  return gql`
    scalar JSON
    scalar Date

    ${WalletTypes}
    
    extend type Query {
      ${WalletQueries}
    }
    
    extend type Mutation {
      ${WalletMutations}
    }
  `;
};

export default typeDefs;
