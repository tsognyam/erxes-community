import asyncComponent from '@erxes/ui/src/components/AsyncComponent';
import React from 'react';
import queryString from 'query-string';
import { Route } from 'react-router-dom';

const List = asyncComponent(() =>
  import(/* webpackChunkName: "List - Tradings" */ './containers/List')
);

const domestic = ({ history, location }) => {
  const queryParams = queryString.parse(location.search);

  return <List full={true} history={history} queryParams={queryParams} />;
};

const routes = () => {
  return <Route path="/trading/stock-statement-list" component={domestic} />;
};

export default routes;
