const tradingWithdrawGet = `
query TradingWithdrawGet($skip: Int, $status: Int, $take: Int, $type: Int, $walletId: JSON) {
  tradingWithdrawGet(skip: $skip, status: $status, take: $take, type: $type, walletId: $walletId) {
    count
    total
    values {
      amount
      bankTransactionId
      createdAt
      createdUserId
      dater
      description
      feeAmount
      id
      status
      type
      updatedAt
      updatedUserId
      userBankAccountId
      walletId
      wallet
      lastName
      firstName
    }
  }
}
`;
export default {
  tradingWithdrawGet
};
