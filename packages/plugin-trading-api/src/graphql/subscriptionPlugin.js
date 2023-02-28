var { withFilter } = require("graphql-subscriptions");
var { gql } = require("apollo-server-express");


module.exports = {
  name: "trading",
  typeDefs: `
    stockMarketChanged: JSON
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
      }

    };
  },
};