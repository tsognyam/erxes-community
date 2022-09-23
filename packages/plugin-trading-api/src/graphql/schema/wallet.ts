export const types = `
 type TradingWallet @key(fields:"id") {
    id: Int!
    currencyCode:String
    userId:String
    status:Int
    createdAt:Date
    createUserId:String
    updatedAt:Date
    updatedUserId:String
    walletNumber:String
    walletNumberModel:JSON
    walletNumberId:Int
    walletBalance:JSON
    stockBalances:JSON
 }
`;
export const queries = `
tradingWallets(type:Int,status:Int, walletIds:[Int]):[TradingWallet]
`;
const params = `
currencyCode:String!,
userId:String,
name:String!,
type:Int!
`;
export const mutations = `
tradingWalletAdd(${params}): TradingWallet
`;
