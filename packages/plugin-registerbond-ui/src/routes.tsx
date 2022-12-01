import asyncComponent from '@erxes/ui/src/components/AsyncComponent';
import queryString from 'query-string';
import React from 'react';
import { Route } from 'react-router-dom';

const List = asyncComponent(() =>
  import(/* webpackChunkName: "List - Registerbonds" */ './containers/List')
);

const BondDetail = asyncComponent(() =>
  import(
    /* webpackChunkName: "List - Registerbonds" */ './containers/BondDetail'
  )
);

const InterestPayment = asyncComponent(() =>
  import(
    /* webpackChunkName: "List - Registerbonds" */ './containers/InterestPayment'
  )
);

const registerBond = ({ location, history }) => {
  const queryParams = queryString.parse(location.search);

  return <List queryParams={queryParams} history={history} />;
};

const bondDetail = ({ match, location, history }) => {
  const queryParams = queryString.parse(location.search);
  const id = match.params.id;

  return <BondDetail _id={id} queryParams={queryParams} history={history} />;
};

const interestPayment = ({ match, location, history }) => {
  const queryParams = queryString.parse(location.search);
  const id = match.params.id;

  return (
    <InterestPayment _id={id} queryParams={queryParams} history={history} />
  );
};

const routes = () => {
  return (
    <React.Fragment>
      <Route path="/bond-list" exact={true} component={registerBond} />
      <Route
        key="/bond-list/bond/details/:bondId"
        exact={true}
        path="/bond-list/bond/details/:bondId"
        component={bondDetail}
      />
      <Route
        key="/bond-list/interestPayment/details/:interestPaymentId"
        exact={true}
        path="/bond-list/interestPayment/details/:interestPaymentId"
        component={interestPayment}
      />
    </React.Fragment>
  );
};

export default routes;
