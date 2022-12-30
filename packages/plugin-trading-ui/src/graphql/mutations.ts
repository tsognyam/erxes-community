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
mutation tradingOrderAdd($enddate: Date!) {
  tradingOrderAdd(
  ordertype: 2, # 1 Зах зээл, 2 Market
  txntype: 1, #
  stockcode: 245,
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
const orderEdit = `
mutation tradingOrderEdit($enddate: Date!) {
  tradingOrderEdit(
  ordertype: 2, # 1 Зах зээл, 2 Market
  txntype: 1, #
  stockcode: 245,
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
export default {
  add,
  orderAdd,
  orderEdit
};
