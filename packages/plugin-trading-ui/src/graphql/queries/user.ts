const tradingUserByPrefix = `
query TradingUserByPrefix($userId: String, $prefix: String,$page:Int,$perPage:Int,$prefixs:[String],$sortDirection:String,$sortField:String,$searchValue:String) {
  tradingUserByPrefix(userId: $userId, prefix: $prefix,page:$page,perPage:$perPage,prefixs:$prefixs,sortDirection:$sortDirection,sortField:$sortField,searchValue:$searchValue) {
    count
    total
    values {
      Wallet {
        createUserId
        createdAt
        currencyCode
        id
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
const tradingUsers = `
query TradingUserByPrefix($userId: String, $prefix: String,$page:Int,$perPage:Int,$prefixs:[String],$searchValue:String) {
  tradingUserByPrefix(userId: $userId, prefix: $prefix,page:$page,perPage:$perPage,prefixs:$prefixs,searchValue:$searchValue) {
    count
    total
    values {
      id
      prefix
      userId
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
  tradingUsersCountByYear,
  tradingUsers
};
