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
    Wallet:JSON
    walletId:Int
}
`;
export const queries = `
tradingBankTransactions(ids:[Int]):[TradingBankTransaction]
tradingBankTransactionDetail(id:Int!):TradingBankTransaction
`;
const params = `
ContAccount:String!,
Account:String!,
RecAccount:String,
AccountName:String,
bankCode:String!,
Currency:String!,
Amount:Float!,
Date:Date,
TXNSIGN:String!,
JRNO:String,
JRITEMNO:String,
AvailableBalance:Float
Desc:String!
`;
export const mutations = `
tradingWalletCharge(${params}):TradingBankTransaction
`;
