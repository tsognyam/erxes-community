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
}
type tradingTransactionList {
    total:Int,
    count:Int,
    beginBalance: Float,
    endBalance: Float
    values:[tradingTransaction]
}
`;

const inputParams = `
startDate:Date
endDate:Date
walletId:Int,
take:Int,
skip:Int
`;

export const queries = `
tradingTransactionGet(${inputParams}):tradingTransactionList
`;