const commonParamDefs = `$currencyCode:String!
 $name: String!
`;
const commonParams = `
currencyCode: $currencyCode
name:$name`;

const add = `
  mutation WalletAdd(${commonParamDefs}) {
    walletAdd(${commonParams}) {
      id
    }
  }
`;

export default {
  add
};
