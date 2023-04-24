import asyncComponent from '@erxes/ui/src/components/AsyncComponent';
import React from 'react';
import queryString from 'query-string';
import { Route } from 'react-router-dom';
const Index = asyncComponent(() => import('./containers/Index'));
const index = ({ history, location }) => {
  const queryParams = queryString.parse(location.search);

  return <Index history={history} queryParams={queryParams} />;
};
const routes = () => {
  return (
    <React.Fragment>
      <Route key="/trading/home" path="/trading/home" component={index} />
    </React.Fragment>
  );
};
export default routes;
