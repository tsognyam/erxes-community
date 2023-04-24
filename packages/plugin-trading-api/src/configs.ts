import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';

import { initBroker } from './messageBroker';
import { getSubdomain } from '@erxes/api-utils/src/core';
import { generateModels } from './connectionResolver';
import permissions = require('./permissions');
import controllers from './router.middleware';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import cpUserMiddleware from './middleware/cpUserMiddleware';
export let mainDb;
export let debug;
export let graphqlPubsub;
export let serviceDiscovery;
export default {
  name: 'trading',
  permissions,
  graphql: async sd => {
    serviceDiscovery = sd;

    return {
      typeDefs: await typeDefs(sd),
      resolvers: await resolvers(sd)
    };
  },
  hasSubscriptions: true,
  apolloServerContext: async (context, req) => {
    const subdomain = getSubdomain(req);
    const models = await generateModels(subdomain);
    context.subdomain = req.hostname;
    context.models = models;
    console.log(req.cpUser);
    if (req.cpUser) {
      context.cpUser = req.cpUser;
    }
    return context;
  },
  middlewares: [cookieParser(), cpUserMiddleware],
  onServerInit: async options => {
    mainDb = options.db;
    const app = options.app;
    app.use(
      bodyParser.urlencoded({
        limit: '100mb',
        extended: true
      })
    );
    app.use(controllers);

    initBroker(options.messageBrokerClient);

    graphqlPubsub = options.pubsubClient;

    debug = options.debug;
  }
};
