const tradingStockTransactionStatement = `
query TradingStockTransactionStatement($endDate: Date, $page: Int!, $perPage: Int!, $startDate: Date, $stockcode: Int, $userId: String, $walletId: Int) {
    tradingStockTransactionStatement(endDate: $endDate, page: $page, perPage: $perPage, startDate: $startDate, stockcode: $stockcode, userId: $userId, walletId: $walletId) {
      values {
        createdAt
        dater
        description
        expectedIncome
        expectedOutcome
        fee
        income
        outcome
        prefix
        price
        stockcode
        stockname
        symbol
        type
        walletId
      }
      total
      count
    }
  }
`;
const tradingStockTransactionStatementSummary = `
query TradingStockTransactionStatementSummary($endDate: Date, $startDate: Date, $stockcode: Int, $userId: String, $walletId: Int) {
    tradingStockTransactionStatementSummary(endDate: $endDate, startDate: $startDate, stockcode: $stockcode, userId: $userId, walletId: $walletId) {
      beginBalance
      endBalance
      expectedIncome
      expectedOutcome
      income
      outcome
    }
  }
`;
export default {
  tradingStockTransactionStatement,
  tradingStockTransactionStatementSummary
};
