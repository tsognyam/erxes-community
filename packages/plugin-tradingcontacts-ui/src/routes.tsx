import App from './App';
import React from 'react';
import { Route } from 'react-router-dom';

const tradingcontactss = () => {
  return <App />;
};

const routes = () => {
  return <Route path="/tradingcontactss/" component={tradingcontactss} />;
};

export default routes;
