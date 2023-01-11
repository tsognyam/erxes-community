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
tradingStockTransactionGet(${inputParams}):tradingStockTransactionList
`;

export const mutations = `
tradingStockTransactionConfirm(${confirmParams}): JSON
`;
