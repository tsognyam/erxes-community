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
userId:String!,
bankCode:String!,
accountNo:String!,
accountName:String!
`;
const updateParams = `
userId:String!,
bankCode:String!,
accountNo:String!,
accountName:String!
`;
const inputParams = `
userId:String,
bankCode:String,
accountNo:String,
accountName:String,
status:Int
`;
export const queries = `
tradingUserBanks(${inputParams}):[TradingUserBank]
`;
export const mutations = `
tradingUserBankAdd(${createParams}):TradingUserBank
tradingUserBankEdit(id:Int!,${updateParams}):TradingUserBank
tradingUserBankRemove(id:Int!):JSON
`;
