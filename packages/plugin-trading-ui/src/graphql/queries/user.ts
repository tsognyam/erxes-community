const tradingUserByPrefix = `
query TradingUserByPrefix($userId: String, $prefix: String,$page:Int,$perPage:Int,$prefixs:[String]) {
  tradingUserByPrefix(userId: $userId, prefix: $prefix,page:$page,perPage:$perPage,prefixs:$prefixs) {
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

const tradingUsersTotalCount = `
query tradingUsersTotalCount {
  tradingUsersTotalCount
}`;
const tradingUsersCountByYear = `
query Query($endYear: Int!, $startYear: Int!) {
  tradingUsersCountByYear(endYear: $endYear, startYear: $startYear)
}
`;
export default {
  tradingUserByPrefix,
  tradingUsersTotalCount,
  tradingUsersCountByYear
};
