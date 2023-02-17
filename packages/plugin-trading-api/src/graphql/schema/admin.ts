export const types = `
scalar Upload

type File {
    filename: String!
    mimetype: String!
    encoding: String!
}

type TradingContractNote @key(fields:"id") {
    id:Int!
    code:String!
    name:String!
    englishName:String!
    gatewayCode:String!
}`;
export const queries = `
tradingGetContractNote:[JSON]
`;
const createParams = `
file: Upload!
`;
export const mutations = `
tradingContractNote(${createParams}):File!
`;
