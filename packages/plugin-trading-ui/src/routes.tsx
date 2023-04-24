import React from 'react';
import OrderListRoutes from './order-list/routes';
import StockListRoutes from './stock-list/routes';
import StockOrderRoutes from './stock-order/routes';
import WalletListRoutes from './wallet-list/routes';
import WithdrawListRoutes from './withdraw-list/routes';
import NominalStockRoutes from './nominal-stock-list/routes';
import NominalStatementRoutes from './nominal-statement-list/routes';
import ContractNoteRoutes from './contract-list/routes';
import HomeRoutes from './home/routes';
import MigrationRoutes from './migration/routes';
import TransactionStatementRoutes from './transaction-statement-list/routes';
import StockStatementRoutes from './stock-statement-list/routes';
import SettlementRoutes from './settlement-list/routes';
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
      <ContractNoteRoutes />
      <MigrationRoutes />
      <TransactionStatementRoutes />
      <StockStatementRoutes />
      <SettlementRoutes />
    </React.Fragment>
  );
};

export default routes;
