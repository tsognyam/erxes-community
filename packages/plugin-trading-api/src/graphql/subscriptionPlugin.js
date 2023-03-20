var { withFilter } = require("graphql-subscriptions");
var { gql } = require("apollo-server-express");


module.exports = {
  name: "trading",
  typeDefs: `
    stockMarketChanged: JSON
    orderBookChanged: JSON
    orderReceived(userId: String!): JSON
		`,
  generateResolvers: (graphqlPubsub) => {
    return {


      /*
       * Listen for stock market data
       */
      stockMarketChanged: {
        subscribe: () =>
          graphqlPubsub.asyncIterator(
            "stockMarketChanged"
          ),
      },
      orderBookChanged: {
        subscribe: () =>
          graphqlPubsub.asyncIterator(
            "orderBookChanged"
          ),
      },
      orderReceived: {
        subscribe: withFilter(
          () => graphqlPubsub.asyncIterator("orderReceived"),
          (payload, variables) => {
            return payload.orderReceived.userId === variables.userId;
          }
        ),
      }

    };
  },
};