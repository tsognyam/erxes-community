var { withFilter } = require('graphql-subscriptions');
var { gql } = require('apollo-server-express');

module.exports = {
  name: 'payment',
  typeDefs: `
    invoiceUpdated(_id: String!): JSON
  `,
  generateResolvers: (graphqlPubsub) => {
    return {
      invoiceUpdated: {
        subscribe: withFilter(
          () => graphqlPubsub.asyncIterator('invoiceUpdated'),
          (payload, variables) => {
            return payload._id === variables._id;
          }
        ),
      },
    };
  },
};
