import React from 'react';
import StatementRoutes from './statement/routes';
import MoneyTransferRoutes from './moneyTransfer/routes';
import TransactionStatementRoutes from './transactionStatement/routes';

const routes = () => {
  return (
    <React.Fragment>
      <StatementRoutes />
      <MoneyTransferRoutes />
      <TransactionStatementRoutes />
    </React.Fragment>
  );
};

export default routes;
