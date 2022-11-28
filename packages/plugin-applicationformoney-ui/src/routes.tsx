import asyncComponent from '@erxes/ui/src/components/AsyncComponent';
import React from 'react';
import { Route } from 'react-router-dom';
import queryString from 'query-string';

const List = asyncComponent(() =>
  import(/* webpackChunkName: "List - Primarytrades" */ './containers/List')
);

const applicationformoney = ({ history, location }) => {
  const queryParams = queryString.parse(location.search);

  return <List history={history} queryParams={queryParams} />;
};

const routes = () => {
  return <Route path="/applicationformoney" component={applicationformoney} />;
};

export default routes;
