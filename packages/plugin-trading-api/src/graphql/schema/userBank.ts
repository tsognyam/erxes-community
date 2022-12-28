export const types = `
type TradingUserBank @key(fields:"id") {
    id:Int!
    userId:String!
    bankCode:String!
    bank: JSON!
    accountNo:String!
    accountName:String!
    status: Int!
    createdAt: Date!
    createdUserId: Int
    updatedAt: Date
    updatedUserId: Int
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
