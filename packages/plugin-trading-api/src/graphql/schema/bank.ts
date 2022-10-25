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
tradingBankDetail(id:Int):TradingBank
`;
const inputParams = `
code:String!,
name:String!,
englishName:String!,
gatewayCode:String!
`;
export const mutations = `
tradingBankAdd(${inputParams}):TradingBank
tradingBankEdit(id:Int!,${inputParams}):TradingBank
tradingBankRemove(id:Int!):JSON
`;
