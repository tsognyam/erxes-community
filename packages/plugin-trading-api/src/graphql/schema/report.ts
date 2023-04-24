export const types = `
type tradingNominalStockBalancesWithAmount {
    symbol:String
    cnt:Float
    amount:Float
    price:Float
}
type tradingStockBalancesWithAmount {
    symbol:String
    cnt:Float
    amount:Float
    price:Float
}
type tradingTransactionBalancesByYear {
    name:String,
    month:Int,
    nominalBalance:Float,
    mcsdBalance:Float
}
`;
export const queries = `
tradingNominalStockBalancesWithAmount(currencyCode:String!):[tradingNominalStockBalancesWithAmount],
tradingStockBalancesWithAmount(userId:String!):[tradingStockBalancesWithAmount],
tradingTransactionBalancesByYear(userId:String!,year:Int!):[tradingTransactionBalancesByYear]
`;
