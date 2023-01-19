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
mutation TradingOrderEdit($cnt: Int!, $ordertype: Int!, $stockcode: Int!, $txnid: Int!, $userId: String!, $price: Float) {
  tradingOrderEdit(cnt: $cnt, ordertype: $ordertype, stockcode: $stockcode, txnid: $txnid, userId: $userId, price: $price) {
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
`;
const orderConfirm = `
mutation TradingOrderConfirm($donecnt: Int!, $donedate: Date!, $doneprice: Float!, $orderId: Int!) {
  tradingOrderConfirm(donecnt: $donecnt, donedate: $donedate, doneprice: $doneprice, orderId: $orderId) {
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
const orderCancel = `mutation TradingOrderCancel($txnid: Int!, $userId: String!, $stockcode: Int!) {
  tradingOrderCancel( txnid: $txnid, userId: $userId, stockcode: $stockcode) {
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
`;
const tradingWalletCharge = `
mutation TradingWalletCharge($amount: Float!, $walletId: Int!) {
  tradingWalletCharge(amount: $amount, walletId: $walletId) {
    accountName
    accountNo
    amount
    bank
    contAccountNo
    createUserId
    createdAt
    currencyCode
    dater
    description
    id
    jrno
    message
    oldDescription
    order
    orderId
    recAccountNo
    status
    txnSign
    type
    updatedAt
    updatedUserId
    wallet
    walletId
    withdraw
  }
}
`;
const tradingWithdrawCreate = `
mutation TradingWithdrawCreate($amount: Float!, $type: Int!, $walletId: Int!) {
  tradingWithdrawCreate(amount: $amount, type: $type, walletId: $walletId) {
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
  }
}
`;
const tradingCustFeeUpdate = `mutation TradingCustFeeUpdate($id: Int!, $value: Float) {
  tradingCustFeeUpdate(id: $id, value: $value) {
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
`;
export default {
  add,
  orderAdd,
  orderEdit,
  orderConfirm,
  orderCancel,
  stockAdd,
  tradingWalletCharge,
  tradingWithdrawCreate,
  tradingCustFeeUpdate
};
