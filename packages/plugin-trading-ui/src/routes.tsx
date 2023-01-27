import React from 'react';
import OrderListRoutes from './order-list/routes';
import StockListRoutes from './stock-list/routes';
import StockOrderRoutes from './stock-order/routes';
import WalletListRoutes from './wallet-list/routes';
import WithdrawListRoutes from './withdraw-list/routes';
import StockWalletListRoutes from './stock-wallet-list/routes';
const routes = () => {
  return (
    <React.Fragment>
      <StockListRoutes />
      <OrderListRoutes />
      <StockOrderRoutes />
      <WalletListRoutes />
      <WithdrawListRoutes />
      <StockWalletListRoutes />
    </React.Fragment>
  );
};

export default routes;
