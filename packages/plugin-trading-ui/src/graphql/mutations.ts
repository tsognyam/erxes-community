const commonParamDefs = `$name: String!`;
const commonParams = `name: $name`;

const add = `
  mutation tradingsAdd(${commonParamDefs}) {
    tradingsAdd(${commonParams}) {
      _id
    }
  }
`;
const orderAdd = `
mutation tradingOrderAdd(
  $cnt: Int!,  
  $enddate: Date!, 
  $ordertype: Int!, 
  $price: Float, 
  $stockcode: Int!, 
  $txntype: Int!,
  $userId:String
  ) {
  tradingOrderAdd(
    cnt: $cnt, 
    enddate: $enddate, 
    ordertype: $ordertype, 
    price: $price, 
    stockcode: $stockcode, 
    txnsource: 2,
    condid:1, 
    txntype: $txntype,
    userId:$userId
  )  
  {
    cnt,
    user
  }
}
`;
const orderEdit = `
mutation tradingOrderEdit($enddate: Date!) {
  tradingOrderEdit(
  ordertype: 2, # 1 Зах зээл, 2 Market
  txntype: 1, #
  stockcode: 3020,
  cnt: 10,
  price: 1000,
  condid: 1, 
  txnsource: 1, #1=self or 2=broker
  enddate: $enddate, 
  )  
  {
    cnt,
    user
  }
}
`;

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
const orderCancel = `
mutation tradingOrder
`;
export default {
  add,
  orderAdd,
  orderEdit,
  stockAdd
};
