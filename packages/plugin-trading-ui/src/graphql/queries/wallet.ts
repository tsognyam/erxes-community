const tradingWallets = `
query TradingWallets($status: Int, $type: Int, $walletIds: [Int],$page:Int,$perPage:Int,$prefix:[String],$currencyCode: [String],$sortDirection:String,$sortField:String,$companyIds:[String],$userIds:[String]) {
  tradingWallets(status: $status, type: $type, walletIds: $walletIds,page:$page,perPage:$perPage,prefix:$prefix,currencyCode:$currencyCode,sortDirection:$sortDirection,sortField:$sortField,companyIds:$companyIds,userIds:$userIds) {
    total,
    count,
    values {
    createUserId
    createdAt
    currencyCode
    name
    id
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
  }
}
`;
const tradingUserWallets = `
query TradingUserWallets($userId: String!, $currencyCode: String) {
  tradingUserWallets(userId: $userId, currencyCode: $currencyCode) {
    createUserId
    createdAt
    currencyCode
    id
    name
    status
    updatedAt
    updatedUserId
    userId
    stockBalances
    user
    walletBalance
    walletNumber
    walletNumberId
    walletNumberModel
  }
}
`;
const tradingStockWallets = `
query TradingStockWallets($page: Int!, $perPage: Int!, $sortDirection: String, $sortField: String, $stockCode: Int, $walletId: Int) {
  tradingStockWallets(page: $page, perPage: $perPage, sortDirection: $sortDirection, sortField: $sortField, stockCode: $stockCode, walletId: $walletId) {
    count
    total
    values {
      balance
      createdAt
      createuserId
      holdBalance
      id
      stockCode
      updatedAt
      updatedUserId
      walletId
      stock {
        symbol
        stockname
      }
      wallet {
        id
        currencyCode
        user
      }
    }
  }
}
`;
const tradingNominalWallet = `
query TradingNominalWallet($currencyCode: String!) {
  tradingNominalWallet(currencyCode: $currencyCode) {
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
}
`;
export default {
  tradingUserWallets,
  tradingWallets,
  tradingStockWallets,
  tradingNominalWallet
};
