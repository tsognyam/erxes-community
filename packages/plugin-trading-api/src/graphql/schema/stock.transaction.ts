export const types = `
type tradingStockTransaction @key(fields:"id") {
    id:Int!
    stockOrderId:Int
    stockOrder:JSON
    walletId:Int
    type:Int
    status:Int
    stockCode: Int
    stock: TradingStock
    stockCount: Int
    dater:Date
    createdAt: Date
    createdUserId: Int
    updatedAt: Date
    updatedUserId: Int
    wallet: TradingWallet
}
type tradingStockTransactionList {
    total:Int,
    count:Int,
    beginBalance: JSON,
    endBalance: JSON
    values:[tradingStockTransaction]
}
type tradingStockTransactionStatement {
    dater:Date,
    createdAt:Date,
    income:Float,
    outcome:Float,
    expectedIncome:Float,
    expectedOutcome:Float,
    description:String,
    walletId:Int,
    type:Int,
    prefix:String,
    stockcode:Int,
    stockname:String,
    symbol:String,
    fee:Float,
    price:Float
}
type tradingStockTransactionStatementSummary {
    income:Float,
    outcome:Float,
    expectedIncome:Float,
    expectedOutcome:Float,
    beginBalance:Float,
    endBalance:Float
}
type tradingStockTransactionStatementList {
    total:Int,
    count:Int,
    values:[tradingStockTransactionStatement]
}
`;

const inputParams = `
startDate:Date
endDate:Date
walletId:Int,
take:Int,
skip:Int
`;
const confirmParams = `
orderId: Int
confirm: Int
`;
export const queries = `
tradingStockTransactionGet(${inputParams}):tradingStockTransactionList,
tradingStockTransactionStatement(
    startDate:Date,
    endDate:Date,
    page:Int!,
    perPage:Int!,
    walletId:Int,
    userId:String,
    stockcode:Int
):tradingStockTransactionStatementList,
tradingStockTransactionStatementSummary(
    startDate:Date,
    endDate:Date,
    walletId:Int,
    userId:String,
    stockcode:Int
):tradingStockTransactionStatementSummary
`;

export const mutations = `
tradingStockTransactionConfirm(${confirmParams}): JSON
`;
