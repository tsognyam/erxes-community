import asyncComponent from '@erxes/ui/src/components/AsyncComponent';
import React from 'react';
import queryString from 'query-string';
import { Route } from 'react-router-dom';

const List = asyncComponent(() =>
  import(/* webpackChunkName: "List - Tradings" */ './containers/Index')
);

const domestic = ({ history, location }) => {
  const queryParams = queryString.parse(location.search);

  return <List history={history} queryParams={queryParams} />;
};

const routes = () => {
  return <Route path="/trading/migration" component={domestic} />;
};

export default routes;
