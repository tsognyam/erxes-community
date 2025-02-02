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

const stockEdit = `
mutation TradingStockEdit($id: Int!, $cnt: Int, $boardname: String, $brchno: String, $closeprice: Float, $currencyCode: String, $enddate: Date, $exchangeid: Int, $externalid: String, $image: String, $inducode: String, $intrate: Int, $ipo: Int, $ipoexecution: Float, $ipotype: Int, $maxprice: Float, $minprice: Float, $multiplier: Int, $no: String, $notiftype: Int, $openprice: Float, $orderBegindate: Date, $orderEnddate: Date, $paytype: String, $startdate: Date, $status: Int, $stockcode: Int, $stockfee: Float, $stockname: String, $stockprice: Float, $stocktypeId: Int, $symbol: String, $url: String, $userId: String) {
  tradingStockEdit(id: $id, cnt: $cnt, boardname: $boardname, brchno: $brchno, closeprice: $closeprice, currencyCode: $currencyCode, enddate: $enddate, exchangeid: $exchangeid, externalid: $externalid, image: $image, inducode: $inducode, intrate: $intrate, ipo: $ipo, ipoexecution: $ipoexecution, ipotype: $ipotype, maxprice: $maxprice, minprice: $minprice, multiplier: $multiplier, no: $no, notiftype: $notiftype, openprice: $openprice, order_begindate: $orderBegindate, order_enddate: $orderEnddate, paytype: $paytype, startdate: $startdate, status: $status, stockcode: $stockcode, stockfee: $stockfee, stockname: $stockname, stockprice: $stockprice, stocktypeId: $stocktypeId, symbol: $symbol, url: $url, userId: $userId) {
    boardname
    brchno
    buyprice
    buyvol
    closeprice
    cnt
    currencyCode
    enddate
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
    lastprice
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
    prevprice
    regdate
    sellprice
    sellvol
    startdate
    status
    stockcode
    stockfee
    stockname
    stockprice
    stocktypeId
    symbol
    totalamount
    trades
    txndate
    url
    userId
    volume
    vwap
  }
}
`;
export default {
  stockAdd,
  stockEdit
};
