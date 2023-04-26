export const types = `
 type TradingWallet @key(fields:"id") {
    id: Int! 
    currencyCode:String 
    userId:String
    name:String
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
    user:JSON
 }
 type TradingStockWallet @key(fields:"id") {
   id:Int!
   stockCode:Int
   walletId:Int
   balance:Int
   holdBalance:Int
   createdAt:Date
   createuserId:String
   updatedAt:Date
   updatedUserId:String
   stock:TradingStock
   wallet:TradingWallet
 }
 type TradingStockWalletList {
   total:Int,
   count:Int,
   values:[TradingStockWallet]
 }
 type TradingWalletList {
  total:Int,
  count:Int,
  values:[TradingWallet]
 }
`;
export const queries = `
tradingWallets(
  type:Int,
  status:Int, 
  walletIds:[Int],
  page:Int,
  perPage:Int,
  prefix:[String],
  currencyCode: [String],
  sortDirection:String,
  sortField:String,
  companyIds:[String],
  customerIds:[String]
  ):TradingWalletList
tradingUserWallets(userId:String!,currencyCode:String):[TradingWallet]
tradingStockWallets(
   page:Int!,
   perPage:Int!,
   walletId:Int,
   stockCode:Int,
   sortField:String,
   sortDirection:String
):TradingStockWalletList
tradingNominalWallet(currencyCode:String!):TradingWallet
`;
const params = `
currencyCode:String,
userId:String,
name:String!,
type:Int
`;
export const mutations = `
tradingWalletAdd(${params}): TradingWallet
`;
