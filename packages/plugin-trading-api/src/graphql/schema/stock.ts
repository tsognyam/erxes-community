export const types = `
"This Stock type has securities, bond, any stock."

type TradingStock @key(fields:"id") {
    id: Int!
    "it's code of stock listed in mse"
    stockcode:Int! # it's code of stock listed in mse
    symbol:String!
    "stocktypeId:securities=1,companyBond=2,govBond=3"
    stocktypeId:Int!
    stockname:String
    stockprice:Float
    minprice:Float
    maxprice:Float
    openprice:Float
    closeprice:Float
    lastprice:Float
    prevprice:Float
    buyprice:Float
    buyvol:Int
    sellprice:Float
    sellvol:Int
    totalamount:Int
    trades:Int
    volume:Int
    vwap:Float
    txndate:Date
    startdate:Date
    enddate:Date
    userId:String
    brchno:String
    regdate:Date!
    status:String!
    no:String
    cnt:Float
    boardname:String
    inducode:String
    lsttxndate:Date
    "ipo:inital=0,public=1"
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
    "currencyCode:MNT,USD,...etc"
    currencyCode:String!
}
type TradingStockList {
    values:[TradingStock]
    total:Int
    count:Int
}

type filterType {
    startsWith: String
    contains: String
    endsWith: String
}
`;
export const queries = `
tradingStocks(
    detail:Boolean,
    skip:Int,
    take:Int,
    stockcode:Int,
    stockname:JSON,
    symbol:JSON
):TradingStockList

tradingGetPosition(
    stockcode:Int,
    userId:String!,
    beginDate:Date!,
    endDate:Date!
):JSON

tradingOrderBook(stockcode: Int): JSON

tradingExecutedBook(stockcode: Int, beginDate: Date, endDate: Date): JSON
`;
const createParams = `
stockcode:Int!,
symbol:String!,
currencyCode:String,
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
no:String
cnt:Int
boardname:String
inducode:String
ipo:Int!
externalid:String
paytype:String
multiplier:Int
order_begindate:Date
order_enddate:Date
notiftype:Int
stockfee:Float
exchangeid:Int!
ipotype:Int
ipoexecution:Float
url:String
image:String
`;
const editParams = `
id:Int!,
stockcode:Int,
symbol:String,
currencyCode:String,
stocktypeId:Int,
stockname:String,
stockprice:Float,
minprice:Float,
maxprice:Float,
openprice:Float,
closeprice:Float,
startdate:Date,
enddate:Date,
intrate:Int,
userId:String,
brchno:String
no:String
cnt:Int
boardname:String
inducode:String
ipo:Int
externalid:String
paytype:String
multiplier:Int
order_begindate:Date
order_enddate:Date
notiftype:Int
stockfee:Float
exchangeid:Int
ipotype:Int
ipoexecution:Float
url:String
image:String,
status:Int,
currencyCode:String
`;
export const mutations = `
tradingStockAdd(${createParams}):TradingStock
tradingStockEdit(${editParams}):TradingStock
tradingStockRemove(id:Int):JSON
`;
