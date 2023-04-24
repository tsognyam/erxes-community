import customScalars from '@erxes/api-utils/src/customScalars';

const resolvers: any = async serviceDiscovery => ({
  ...customScalars,
  Mutation: {},
  Query: {}
});

export default resolvers;
