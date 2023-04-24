export const types = `
type tradingTransaction @key(fields:"id") {
    id:Int!
    orderId:Int
    order:JSON
    walletId:Int
    type:Int
    status:Int
    description:String
    amount:Float
    beforeBalance:Float
    afterBalance:Float
    dater:Date
    createdAt: Date
    createdUserId: Int
    updatedAt: Date
    updatedUserId: Int
    wallet:JSON
    user:JSON
}
type tradingTransactionList {
    total:Int,
    count:Int,
    beginBalance: Float,
    endBalance: Float
    values:[tradingTransaction]
}
type tradingTransactionStatement {
    dater:Date,
    createdAt:Date,
    income:Float,
    outcome:Float,
    expectedIncome:Float,
    expectedOutcome:Float,
    description:String,
    walletId:Int,
    beforeBalance:Float,
    afterBalance:Float,
    type:Int,
    prefix:String
}
type tradingTransactionStatementSummary {
    income:Float,
    outcome:Float,
    expectedIncome:Float,
    expectedOutcome:Float,
    beginBalance:Float,
    endBalance:Float
}
type tradingTransactionStatementList {
    total:Int,
    count:Int,
    values:[tradingTransactionStatement]
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
orderId:Int!,
confirm:Int!
`;
export const queries = `
tradingTransactionGet(${inputParams}):tradingTransactionList,
tradingTransactionNominalList(
startDate:Date,
endDate:Date,
page:Int,
perPage:Int,
status:Int
):tradingTransactionList,
tradingTransactionStatement(
    startDate:Date,
    endDate:Date,
    page:Int!,
    perPage:Int!,
    walletId:Int,
    userId:String
):tradingTransactionStatementList,
tradingTransactionStatementSummary(
    startDate:Date,
    endDate:Date,
    walletId:Int,
    userId:String
):tradingTransactionStatementSummary
`;
export const mutations = `
tradingTransactionConfirm(${confirmParams}):JSON
`;
