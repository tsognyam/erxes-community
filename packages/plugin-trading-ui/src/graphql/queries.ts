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
  $status: [Int], 
  $stockcode: [Int],
  $prefix:[String], 
  $txntype: [Int],
  $ordertype:[Int],
  $sortField:String,
  $sortDirection:String,
  $startDate:Date,
  $endDate:Date,
  $userId:String
  ) 
{
  tradingOrders(
    page: $page, 
    perPage: $perPage, 
    status: $status, 
    stockcode: $stockcode, 
    txntype: $txntype,
    sortField:$sortField,
    sortDirection:$sortDirection,
    startDate:$startDate,
    endDate:$endDate,
    userId:$userId,
    prefix:$prefix,
    ordertype:$ordertype
    ) {
    total,
    count,
    values {
      brchno
      cnt
      condid
      descr
      descr2
      donecnt
      donedate
      doneprice
      enddate
      fee
      filename
      ipaddress
      ipo
      mseExecutionId
      mseOrderId
      msgid
      orderno
      ordertype
      originalCnt
      originalDonePrice
      originalPrice
      ostatus
      oupdateUserId
      oupdatedate
      price
      regdate
      settlementMCSD
      settlementMCSDId
      settlementMSCC
      settlementMSCCId
      startdate
      status
      stock
      stockOrder
      stockOrderId
      stockcode
      tradecode
      tranOrderId
      transactionOrder
      txndate
      txnid
      txnsource
      txntype
      updateUserId
      updatedate
      user
      userId
      wallet
      walletId
      yield  
    }
  }
}
`;
const stockList = `
query TradingStocks {
  tradingStocks {
    values {
      stockcode,
      stockname,
      symbol,
      openprice,
      closeprice,
      order_enddate
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
const tradingTransactionStatement = `
query TradingTransactionStatement($endDate: Date, $page: Int, $perPage: Int, $startDate: Date) {
  tradingTransactionStatement(endDate: $endDate, page: $page, perPage: $perPage, startDate: $startDate) {
    values {
      createdAt
      dater
      expectedIncome
      expectedOutcome
      feeAmount
      income
      outcome
      price
      stockcode
      stockname
      symbol
      type
      totalAmount
    }
    total
    count
  }
}
`;
export default {
  list,
  totalCount,
  orderList,
  stockList,
  TradingStocks,
  tradingWallets,
  tradingUserWallets,
  tradingCustFeeList,
  tradingTransactionGet,
  tradingWithdrawGet,
  tradingUserByPrefix,
  tradingStockWallets,
  tradingTransactionNominalList,
  tradingTransactionStatement
};
