export const types = `
type TradingOrder @key(fields:"txnid") {
    txnid: Int!
    ordertype:Int
    txntype:Int!
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
type TradingOrderTypes @key(fields:"id") {
    id:Int
    name:String
    name2:String
    listorder:Int
    activeTime:String!
    status:Int
}
`;
export const queries = `
tradingOrders(params:JSON):[TradingOrder]
tradingOrderDetail(id:Int!):TradingOrder
tradingOrderTypes:[TradingOrderTypes]
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
tradingOrderAdd(${params}):TradingOrder,
tradingOrderEdit(${params}):TradingOrder,
tradingOrderCancel(${cancelParams}):JSON`;
