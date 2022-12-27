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
  $txntype: Int
  ) 
{
  tradingOrders(
    page: $page, 
    perPage: $perPage, 
    status: $status, 
    stockcode: $stockcode, 
    txntype: $txntype) {
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
const totalCount = `
  query tradingsTotalCountQuery {
    tradingsTotalCount
  }
`;

export default {
  list,
  totalCount,
  orderList
};
