import { gql } from 'apollo-server-express';

const typeDefs = async _serviceDiscovery => {
  return gql`
    scalar JSON
    scalar Date
  `;
};

export default typeDefs;
