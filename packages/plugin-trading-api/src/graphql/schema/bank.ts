export const types = `
type TradingBank @key(fields:"id") {
    id:Int!
    code:String!
    name:String!
    englishName:String!
    gatewayCode:String!
}`;
export const queries = `
tradingBanks:[TradingBank]
tradingBankDetail(id:Int!):TradingBank
`;
const createParams = `
code:String!,
name:String!,
englishName:String!,
gatewayCode:String!
`;
const updateParams = `
code:String,
name:String,
englishName:String,
gatewayCode:String
`;
export const mutations = `
tradingBankAdd(${createParams}):TradingBank
tradingBankEdit(id:Int!,${updateParams}):TradingBank
tradingBankRemove(id:Int!):JSON
`;
