import asyncComponent from '@erxes/ui/src/components/AsyncComponent';
import React from 'react';
import queryString from 'query-string';
import { Route } from 'react-router-dom';

const List = asyncComponent(() =>
  import(/* webpackChunkName: "List - Tradings" */ './containers/List')
);
const Detail = asyncComponent(() =>
  import(/* webpackChunkName: "CustomerDetails" */ './containers/Detail')
);
const list = ({ history, location }) => {
  const queryParams = queryString.parse(location.search);

  return <List history={history} queryParams={queryParams} />;
};

const detail = ({ match }) => {
  const id = match.params.id;
  const queryParams = queryString.parse(location.search);

  return <Detail id={id} queryParams={queryParams} />;
};

const routes = () => {
  return (
    <React.Fragment>
      <Route
        key="/trading/wallet-list"
        path="/trading/wallet-list"
        component={list}
      />
      <Route
        key="/trading/account/details/:id"
        exact={true}
        path="/trading/account/details/:id"
        component={detail}
      />
    </React.Fragment>
  );
};

export default routes;
