import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';

import { initBroker } from './messageBroker';
import MSESocket from './socket';

export let mainDb;
export let debug;
export let graphqlPubsub;
export let serviceDiscovery;
export let fixSocket;

export default {
  name: 'trading-mit',
  graphql: async sd => {
    serviceDiscovery = sd;

    return {
      typeDefs: await typeDefs(sd),
      resolvers: await resolvers(sd)
    };
  },

  apolloServerContext: async context => {
    return context;
  },

  onServerInit: async options => {
    mainDb = options.db;

    initBroker(options.messageBrokerClient);
    fixSocket = new MSESocket();
    setInterval(() => {
      if (fixSocket._state != 1) {
        fixSocket.connect();
      }

      console.log('MSE connection alive', fixSocket._state);
    }, 300000);
    graphqlPubsub = options.pubsubClient;

    debug = options.debug;
  }
};
