const stockList = `
query TradingStocks($skip: Int, $symbol: JSON, $take: Int, $detail: Boolean) {
  tradingStocks(skip: $skip, symbol: $symbol, take: $take, detail: $detail) {
    values {
      externalid
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
const TradingStocks = `
query TradingStocks($skip: Int, $symbol: JSON, $take: Int, $detail: Boolean) {
  tradingStocks(skip: $skip, symbol: $symbol, take: $take, detail: $detail) {
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
      enddate
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
const tradingGetPosition = `
query TradingGetPosition($beginDate: Date!, $endDate: Date!, $userId: String!) {
  tradingGetPosition(beginDate: $beginDate, endDate: $endDate, userId: $userId)
}
`;
export default {
  stockList,
  TradingStocks,
  tradingGetPosition
};
