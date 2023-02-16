const stockAdd = `
mutation TradingStockAdd($enddate: Date!, $startdate: Date!, $stockcode: Int!, $stockname: String!, $stockprice: Float!, $stocktypeId: Int!, $symbol: String!, $ipo: Int!, $exchangeid: Int!, $cnt: Int) {
  tradingStockAdd(enddate: $enddate, startdate: $startdate, stockcode: $stockcode, stockname: $stockname, stockprice: $stockprice, stocktypeId: $stocktypeId, symbol: $symbol, ipo: $ipo, exchangeid: $exchangeid, cnt: $cnt) {
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
`;
export default {
  stockAdd
};
