export const types = `
type TradingUserMcsd @key(fields:"id") {
    id:Int!
    firstName:String
    lastName:String
    userId:String
    prefix:String
    clientPrefix: String
    fullPrefix:String
    bdcAccountId:String
    status: Int
    description:String
    createdAt: Date
    createdUserId: Int
    updatedAt: Date
    updatedUserId: Int
    Wallet: [TradingWallet]
}
type TradingUserMcsdList {
    count:Int
    total:Int
    values: [TradingUserMcsd]
}
`;

const inputParams = `
userId:String,
prefix:String,
page:Int,
perPage:Int,
prefixs:[String],
sortDirection:String,
sortField:String,
searchValue:String
`;
export const queries = `
tradingUserByPrefix(${inputParams}):TradingUserMcsdList
tradingUsersTotalCount:Int
tradingUsersCountByYear(
startYear:Int!,
endYear:Int!
):JSON
`;
export const mutations = `
`;
