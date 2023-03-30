const tradingTransactionGet = `
query TradingTransactionGet($walletId: Int, $startDate: Date, $endDate: Date) {
  tradingTransactionGet(walletId: $walletId, startDate: $startDate, endDate: $endDate) {
    beginBalance
    count
    endBalance
    total
    values {
      afterBalance
      amount
      beforeBalance
      createdAt
      createdUserId
      dater
      description
      id
      order
      orderId
      status
      type
      updatedAt
      updatedUserId
      wallet
      walletId
    }
  }
}
`;
const tradingTransactionNominalList = `
query TradingTransactionNominalList($endDate: Date, $startDate: Date,$status:Int,$page:Int,$perPage:Int) {
  tradingTransactionNominalList(endDate: $endDate, startDate: $startDate,status:$status, page:$page, perPage:$perPage) {
    beginBalance
    count
    endBalance
    total
    values {
      afterBalance
      amount
      beforeBalance
      createdAt
      createdUserId
      dater
      description
      id
      order
      orderId
      status
      type
      updatedAt
      updatedUserId
      wallet
      walletId
    }
  }
}
`;
const tradingTransactionStatement = `
query TradingTransactionStatement($endDate: Date, $page: Int!, $perPage: Int!, $startDate: Date, $walletId: Int,$userId:String) {
  tradingTransactionStatement(endDate: $endDate, page: $page, perPage: $perPage, startDate: $startDate, walletId:$walletId,userId:$userId) {
    values {
      createdAt
      dater
      expectedIncome
      expectedOutcome
      income
      outcome
      walletId
      afterBalance
      beforeBalance
      type
      description
      prefix
    }
    total
    count
  }
}
`;
const tradingTransactionStatementSummary = `
query TradingTransactionStatementSummary($endDate: Date, $startDate: Date, $walletId: Int,$userId:String) {
  tradingTransactionStatementSummary(endDate: $endDate, startDate: $startDate, walletId:$walletId,userId:$userId) {
      expectedIncome
      expectedOutcome
      income
      outcome
      beginBalance
      endBalance
  }
}
`;
export default {
  tradingTransactionGet,
  tradingTransactionNominalList,
  tradingTransactionStatement,
  tradingTransactionStatementSummary
};
