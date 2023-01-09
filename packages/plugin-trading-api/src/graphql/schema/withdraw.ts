export const types = `
type tradingWithdraw @key(fields:"id") {
    id:Int!
    walletId:Int
    amount:Float
    status: Int
    type:Int
    feeAmount:Float
    bankTransactionId: Int
    description:String
    dater:Date
    createdAt: Date
    createdUserId: Int
    updatedAt: Date
    updatedUserId: Int
    userBankAccountId:Int
    withdraws: JSON
    user:JSON
}
type tradingWalletList {
    total:Int,
    count:Int,
    values:[tradingWithdraw]
}
`;

const createParams = `
walletId:Int!,
amount:Float!,
type:Int!
description:String
dater:Date
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
status:Int,
take:Int,
skip:Int
`;
const confirmParams = `
requestId:Int
confirm:Int
`;
export const queries = `
tradingWithdrawGet(${inputParams}):tradingWalletList
`;
export const mutations = `
tradingWithdrawCreate(${createParams}):tradingWithdraw
tradingWithdrawCancel(requestId:Int!, userId:String!):JSON
tradingWithdrawConfirm(${confirmParams}):tradingWithdraw
`;
