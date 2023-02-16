export const types = `
type tradingNominalStockBalancesWithAmount {
    symbol:String
    cnt:Float
    amount:Float
    price:Float
}
`;
export const queries = `
tradingNominalStockBalancesWithAmount(currencyCode:String!):[tradingNominalStockBalancesWithAmount]
`;
