import asyncComponent from '@erxes/ui/src/components/AsyncComponent';
import React from 'react';
import queryString from 'query-string';
import { Route, Redirect } from 'react-router-dom';

const List = asyncComponent(() =>
  import(/* webpackChunkName: "List - Primarytrades" */ './containers/List')
);

const commission = ({ history, location }) => {
  const queryParams = queryString.parse(location.search);

  return <List history={history} queryParams={queryParams} />;
};

const routes = () => {
  return (
    <>
      <Route path="/commission" component={commission} />
    </>
  );
};

export default routes;
