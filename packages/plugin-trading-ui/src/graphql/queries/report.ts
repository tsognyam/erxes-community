const tradingNominalStockBalancesWithAmount = `
query TradingNominalStockBalancesWithAmount($currencyCode: String!) {
  tradingNominalStockBalancesWithAmount(currencyCode: $currencyCode) {
    amount
    cnt
    price
    symbol
  }
}
  `;
export default {
  tradingNominalStockBalancesWithAmount
};
