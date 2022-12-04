import React from 'react';
import { Route } from 'react-router-dom';
import asyncComponent from '@erxes/ui/src/components/AsyncComponent';
import queryString from 'query-string';

const List = asyncComponent(() =>
  import(
    /* webpackChunkName: "List - Top 20 Organizations" */ './containers/List'
  )
);

const CreateRegister = asyncComponent(() =>
  import(/* webpackChunkName: "createRegister" */ './containers/Register')
);

const topOrganizations = ({ location, history }) => {
  const queryParams = queryString.parse(location.search);

  return <List queryParams={queryParams} history={history} />;
};

const createRegister = ({ location, history }) => {
  const queryParams = queryString.parse(location.search);

  return <CreateRegister queryParams={queryParams} history={history} />;
};

const routes = () => {
  return (
    <React.Fragment>
      <Route path="/topOrganizations/" component={topOrganizations} />

      <Route
        key="/organizaion/register"
        exact={true}
        path="/organizaion/register"
        component={createRegister}
      />
    </React.Fragment>
  );
};

export default routes;
