var { withFilter } = require("graphql-subscriptions");
var { gql } = require("apollo-server-express");


module.exports = {
  name: "trading",
  typeDefs: `
    stockMarketChanged: JSON
    orderBookChanged: JSON
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
      }

    };
  },
};