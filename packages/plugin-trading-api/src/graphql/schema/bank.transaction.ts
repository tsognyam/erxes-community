export const types = `
type TradingBankTransaction @key(fields:"id") {
    id: Int!
    type:Int!
    amount:Float!
    jrno:String!
    txnSign:String!
    currencyCode:String!
    status:Int!
    orderId:Int
    order:JSON
    description:String!
    oldDescription:String
    dater:Date!
    bank:String!
    recAccountNo:String!
    contAccountNo:String!
    accountNo:String!
    accountName:String!
    message:String
    createdAt:Date
    createUserId:Int
    updatedAt:Date
    updatedUserId:Int
    withdraw:JSON
    wallet:JSON
    walletId:Int
}
`;
export const queries = `
tradingBankTransactions(ids:[Int]):[TradingBankTransaction]
tradingBankTransactionDetail(id:Int!):TradingBankTransaction
`;
const params = `
contAccount:String!,
account:String!,
recAccount:String,
accountName:String,
bankCode:String!,
currencyCode:String!,
amount:Float!,
date:Date,
txnsign:String!,
jrno:String,
jritemno:String,
availablebalance:Float
desc:String!
`;
export const mutations = `
tradingWalletCharge(${params}):TradingBankTransaction
`;
