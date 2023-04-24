const stockMarketChanged = `
  subscription stockMarketChanged {
    stockMarketChanged
  }
`;
const orderBookChanged = `
  subscription {
    orderBookChanged
  }
`;

export default {
  stockMarketChanged,
  orderBookChanged
};
