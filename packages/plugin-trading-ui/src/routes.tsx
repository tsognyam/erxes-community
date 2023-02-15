import React from 'react';
import OrderListRoutes from './order-list/routes';
import StockListRoutes from './stock-list/routes';
import StockOrderRoutes from './stock-order/routes';
import WalletListRoutes from './wallet-list/routes';
import WithdrawListRoutes from './withdraw-list/routes';
import NominalStockRoutes from './nominal-stock-list/routes';
import NominalStatementRoutes from './nominal-statement-list/routes';
import HomeRoutes from './home/routes';
const routes = () => {
  return (
    <React.Fragment>
      <HomeRoutes />
      <StockListRoutes />
      <OrderListRoutes />
      <StockOrderRoutes />
      <WalletListRoutes />
      <WithdrawListRoutes />
      <NominalStockRoutes />
      <NominalStatementRoutes />
    </React.Fragment>
  );
};

export default routes;
