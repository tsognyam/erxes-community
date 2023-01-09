import React from 'react';
import OrderListRoutes from './order-list/routes';
import StockListRoutes from './stock-list/routes';
import StockOrderRoutes from './stock-order/routes';
import WalletListRoutes from './wallet-list/routes';
import StatementListRoutes from './statement-list/routes';
const routes = () => {
  return (
    <React.Fragment>
      <StockListRoutes />
      <OrderListRoutes />
      <StockOrderRoutes />
      <WalletListRoutes />
      <StatementListRoutes />
    </React.Fragment>
  );
};

export default routes;
