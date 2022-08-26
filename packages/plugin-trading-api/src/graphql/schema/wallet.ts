export const types = `
 type Wallet @key(fields:"id") {
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
wallets(type:Int,status:Int, walletIds:[Int]):[Wallet]
`;
const params = `
currencyCode:String!,
userId:String,
name:String!,
`;
export const mutations = `
walletAdd(${params}): Wallet
`;
