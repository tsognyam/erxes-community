export const types = `
type TradingStock @key(fields:"id") {
    id: Int!
    stockcode:Int!
    symbol:String!
    stocktypeId:Int!
    stockname:String
    stockprice:Float
    minprice:Float
    maxprice:Float
    openprice:Float
    closeprice:Float
    startdate:Date
    userId:String
    brchno:String
    regdate:Date!
    status:String!
    no:String
    cnt:Int
    boardname:String
    inducode:String
    lsttxndate:Date
    ipo:Int
    intrate2:Float
    externalid:String
    paytype:String
    multiplier:Int
    externalid2:String
    order_begindate:Date
    order_enddate:Date
    notiftype:Int
    stockfee:Float
    exchangeid:Int!
    ipotype:Int
    ipoexecution:Float
    url:String
    image:String
    currencyCode:String!
}
type TradingStockList {
    stocks:[TradingStock]
    totalCount:Int
}
`;
export const queries = `
tradingStocks(
    page:Int,
    perPage:Int,
    stockcode:Int,
    stockname:String,
    symbol:String
):TradingStockList
`;
const createParams = `
stockcode:Int!,
symbol:String!,
stocktypeId:Int!,
stockname:String!,
stockprice:Float!,
minprice:Float,
maxprice:Float,
openprice:Float,
closeprice:Float,
startdate:Date!,
enddate:Date!,
intrate:Int,
userId:String,
brchno:String
`;
const editParams = `
id:Int,
stockcode:Int,
symbol
`;
export const mutations = `
tradingStockAdd(${createParams}):TradingStock
tradingStockEdit(${editParams}):TradingStock
tradingStockRemove():[]
`;
