export const types = `
type TradingWithdraw @key(fields:"id") {
    id:Int!
    walletId:Int!
    amount:Float!
    status: Int!
    type:Int!
    feeAmount:Float!
    bankTransactionId: Int!
    description:String
    dater:Date
    createdAt: Date!
    createdUserId: Int
    updatedAt: Date
    updatedUserId: Int
    userBankAccountId:Int!
    withdraws: JSON
}`;

const createParams = `
walletId:Int!,
amount:Float!,
status:Int!,
type:Int!
feeAmount:Float
bankTransactionId:Int
description:String
dater:Date
createdAt:Date
createdUserId:Int
updatedAt:Date
updatedUserId:Int
userBankAccountId:Int
`;
const updateParams = `
walletId:Int!,
amount:Float!,
status:Int!,
type:Int!
feeAmount:Float
bankTransactionId:Int
description:String
dater:Date
createdAt:Date
createdUserId:Int
updatedAt:Date
updatedUserId:Int
userBankAccountId:Int
`;
const inputParams = `
walletId:Int,
type:Int,
status:Int
`;
export const queries = `
tradingWithdrawGet(${inputParams}):[tradingWithdraw]
`;
export const mutations = `
tradingWithdrawCreate(${createParams}):tradingWithdraw
tradingWithdrawUpdate(id:Int!,${updateParams}):tradingWithdraw
tradingWithdrawCancel(id:Int!):JSON
`;
