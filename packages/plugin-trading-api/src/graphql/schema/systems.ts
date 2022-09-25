export const types = `
type TradingSystem @key(fields:"_id") {
    _id:String!
    name:String
    value:String
    createdAt:Date
}
`;
export const queries = `
tradingSystems(searchValue:String,systemIds:[String]):[TradingSystem]
tradingSystemDetail(_id:String!):TradingSystem
`;
const params = `
name:String!,
value:String!
`;
export const mutations = `
tradingSystemsAdd(${params}):TradingSystem
`;
