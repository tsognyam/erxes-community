export const types = `
type TradingUserMcsd @key(fields:"id") {
    id:Int!
    userId:String
    prefix:String
    clientPrefix: String
    fullPrefix:String
    bdcAccountId:String
    status: Int
    createdAt: Date
    createdUserId: Int
    updatedAt: Date
    updatedUserId: Int
}`;

const inputParams = `
prefix:String
`;
export const queries = `
tradingUserByPrefix(${inputParams}):[TradingUserMcsd]
`;
export const mutations = `
`;
