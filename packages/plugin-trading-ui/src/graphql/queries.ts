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
export default {
  list,
  totalCount,
  orderList,
  stockList,
  TradingStocks,
  prefixList,
  tradingWallets
};
