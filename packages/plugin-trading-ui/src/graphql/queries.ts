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
    cnt,
    condid,
    stock
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
