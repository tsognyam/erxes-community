const tradingBankTransactions = `
query TradingBankTransactions($endDate: Date, $startDate: Date, $status: Int, $page: Int!, $perPage: Int!) {
    tradingBankTransactions(endDate: $endDate, startDate: $startDate, status: $status, page: $page, perPage: $perPage) {
      count
      total
      values {
        accountName
        accountNo
        amount
        bank
        contAccountNo
        createUserId
        createdAt
        currencyCode
        dater
        description
        id
        jrno
        message
        oldDescription
        order
        orderId
        recAccountNo
        status
        txnSign
        type
        updatedAt
        updatedUserId
        wallet
        walletId
        withdraw
      }
    }
}`;
export default {
  tradingBankTransactions
};
