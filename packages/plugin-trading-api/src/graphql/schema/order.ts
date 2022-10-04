export const types = `
type TradingOrder @key(fields:"txnid") {
    txnid: Int!
    orderType:Int
    txnType:Int!
    walletId:Int
    wallet:JSON!
    orderno:String!
    stockcode:Int!
    stock:JSON!
    txndate:Date!
    originalCnt:Int!
    cnt:Int!
    price:Float!
    fee:Float!
    donedate:Date
    donecnt:Int
    doneprice:Float
    startdate:Date
    enddate:Date
    descr:String
    descr2:String
    txnsource:Int
    condid:Int
    userId:String
    brchno:String
    regdate:Date
    status:Int
    updatedate:Date
    updateUserId:Int
    ostatus:Int
    oupdatedate:Date
    oupdateUserId:Int
    tradecode:String
    yield:Int
    msgid:Int
    ipo:Int
    ipaddress:String
    filename:String
    mseExecutionId:String
    mseOrderId:String
    tranOrderId:Int
    stockOrderId:Int
    settlementMSCCId:Int
    settlementMSCC:JSON
    settlementMCSDId:Int
    settlementMCSD:JSON
    transactionOrder:JSON
    stockOrder:JSON
}
`;
export const queries = `
tradingOrders(ids:[Int]):[TradingOrder]
tradingOrderDetail(id:Int!):TradingOrder
`;
const params = `
ordertype:Int!,
txntype:Int!,
stockcode:Int!,
cnt:Int!,
price:Float!,
enddate:Date!,
condid:Int!,
txnsource:Int!,
userId:String
`;
const cancelParams = `
stockcode:Int!,
txnid:Int!,
userId:Int
`;
export const mutations = `
tradingOrderCreate(${params}):TradingOrder,
tradingOrderUpdate(${params}):TradingOrder,
tradingOrderCancel(${cancelParams}):JSON`;