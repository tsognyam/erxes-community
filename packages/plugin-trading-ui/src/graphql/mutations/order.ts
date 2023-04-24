const orderAdd = `
mutation tradingOrderAdd(
  $cnt: Int!,  
  $enddate: Date, 
  $ordertype: Int!, 
  $price: Float, 
  $stockcode: Int!, 
  $txntype: Int!,
  $userId:String,
  $condid:Int
  ) {
  tradingOrderAdd(
    cnt: $cnt, 
    enddate: $enddate, 
    ordertype: $ordertype, 
    price: $price, 
    stockcode: $stockcode, 
    txnsource: 2,
    condid:$condid, 
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
mutation TradingOrderEdit($cnt: Int!, $txnid: Int!, $price: Float) {
  tradingOrderEdit(cnt: $cnt, txnid: $txnid, price: $price) {
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
const orderCancel = `mutation TradingOrderCancel($txnid: Int!) {
    tradingOrderCancel( txnid: $txnid) {
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
export default {
  orderAdd,
  orderEdit,
  orderConfirm,
  orderCancel
};
