const list = `
  query tradingsQuery {
    tradings {
      _id
      name
    }
  }
`;
const orderList = `
query TradingOrders {
  tradingOrders {
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
