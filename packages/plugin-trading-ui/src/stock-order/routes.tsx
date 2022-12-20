import asyncComponent from '@erxes/ui/src/components/AsyncComponent';
import React from 'react';
import queryString from 'query-string';
import { Route } from 'react-router-dom';

const Board = asyncComponent(() =>
  import(/* webpackChunkName: "Board - Tradings" */ './containers/Board')
);

const domestic = ({ history, location }) => {
  const queryParams = queryString.parse(location.search);

  return <Board history={history} queryParams={queryParams} />;
};

const routes = () => {
  return <Route path="/domestic/stock-order" component={domestic} />;
};

export default routes;
