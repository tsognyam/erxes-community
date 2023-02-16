const tradingUserByPrefix = `
query TradingUserByPrefix($userId: String, $prefix: String) {
  tradingUserByPrefix(userId: $userId, prefix: $prefix) {
    count
    total
    values {
      Wallet {
        createUserId
        createdAt
        currencyCode
        firstName
        id
        lastName
        name
        status
        stockBalances
        updatedAt
        updatedUserId
        user
        userId
        walletBalance
        walletNumber
        walletNumberId
        walletNumberModel
      }
      bdcAccountId
      clientPrefix
      createdAt
      createdUserId
      fullPrefix
      id
      prefix
      status
      updatedAt
      updatedUserId
      userId
      firstName
      lastName
    }
  }
}
`;
export default {
  tradingUserByPrefix
};
