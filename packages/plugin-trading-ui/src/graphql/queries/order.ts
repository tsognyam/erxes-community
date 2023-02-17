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
export default {
  orderList
};
