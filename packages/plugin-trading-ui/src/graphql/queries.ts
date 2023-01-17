const list = `
  query tradingsQuery {
    tradings {
      _id
      name
    }
  }
`;
const orderList = `
query tradingOrders(
  $page: Int!, 
  $perPage: Int!, 
  $status: Int, 
  $stockcode: Int, 
  $txntype: Int,
  $sortField:String,
  $sortDirection:String
  ) 
{
  tradingOrders(
    page: $page, 
    perPage: $perPage, 
    status: $status, 
    stockcode: $stockcode, 
    txntype: $txntype,
    sortField:$sortField,
    sortDirection:$sortDirection
    ) {
    total,
    count,
    values {
      txnid,
      ordertype,
      txntype,
      walletId,
      wallet,
      orderno,
      stockcode,
      stock,
      txndate,
      originalCnt,
      cnt,
      price,
      fee,
      donedate,
      donecnt,
      doneprice,
      descr,
      descr2,
      status,
      regdate,
      condid
    }
  }
}
`;
const prefixList = `
query TradingUserByPrefix {
  tradingUserByPrefix {
    userId,
    prefix
  }
}
`;
const stockList = `
query TradingStocks {
  tradingStocks {
    values {
      stockcode,
      stockname,
      symbol
    }
  }
}
`;
const totalCount = `
  query tradingsTotalCountQuery {
    tradingsTotalCount
  }
`;

const TradingStocks = `
query TradingStocks($skip: Int, $symbol: JSON, $take: Int) {
  tradingStocks(skip: $skip, symbol: $symbol, take: $take) {
    count
    total
    values {
      boardname
      brchno
      closeprice
      cnt
      currencyCode
      exchangeid
      externalid
      externalid2
      id
      image
      inducode
      intrate2
      ipo
      ipoexecution
      ipotype
      lsttxndate
      maxprice
      minprice
      multiplier
      no
      notiftype
      openprice
      order_begindate
      order_enddate
      paytype
      regdate
      startdate
      status
      stockcode
      stockfee
      stockname
      stockprice
      stocktypeId
      symbol
      url
      userId
    }
  }
}
`;
const tradingWallets = `
query TradingWallets($status: Int, $type: Int, $walletIds: [Int]) {
  tradingWallets(status: $status, type: $type, walletIds: $walletIds) {
    createUserId
    createdAt
    currencyCode
    name
    firstName
    lastName
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
`;
const tradingUserWallets = `
query TradingUserWallets($userId: String!, $currencyCode: String) {
  tradingUserWallets(userId: $userId, currencyCode: $currencyCode) {
    createUserId
    createdAt
    currencyCode
    firstName
    id
    lastName
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
const tradingCustFeeList = `
query TradingCustFeeGetList($userId: String) {
  tradingCustFeeGetList(userId: $userId) {
    count
    total
    values {
      descr
      id
      name
      name2
      sidetype
      status
      stocktypeId
      updatedby
      updateddate
      user
      userId
      value
    }
  }
}
`;
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
const tradingWithdrawGet = `
query TradingWithdrawGet($skip: Int, $status: Int, $take: Int, $type: Int, $walletId: Int) {
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
      user
      userBankAccountId
      walletId
      withdraws
    }
  }
}
`;
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
  list,
  totalCount,
  orderList,
  stockList,
  TradingStocks,
  prefixList,
  tradingWallets,
  tradingUserWallets,
  tradingCustFeeList,
  tradingTransactionGet,
  tradingWithdrawGet,
  tradingUserByPrefix
};
