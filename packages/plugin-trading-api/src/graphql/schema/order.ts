export const types = `
type TradingOrder @key(fields:"txnid") {
    txnid: Int!
    ordertype:Int
    txntype:Int!
    walletId:Int
    wallet:JSON
    orderno:String
    stockcode:Int!
    stock:JSON
    txndate:Date!
    originalCnt:Int!
    originalPrice:Float
    originalDonePrice:Float
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
    updateUserId:String
    ostatus:Int
    oupdatedate:Date
    oupdateUserId:String
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
    user:JSON
}
type TradingOrderList {
    total:Int,
    count:Int,
    values:[TradingOrder]
}
type TradingOrderSummary {
    total:Float,
    fee:Float
}
`;
export const queries = `
tradingOrders(
    page:Int!,
    perPage:Int!,
    stockcode:[Int],
    status:[Int],
    txntype:[Int],
    ordertype:[Int],
    sortField:String,
    sortDirection:String,
    startDate:Date,
    endDate:Date,
    userId:String,
    prefix:[String]
):TradingOrderList
tradingOrderDetail(id:Int!):TradingOrder
tradingOrderSummary(
    stockcode:[Int],
    status:[Int],
    txntype:[Int],
    ordertype:[Int],
    startDate:Date,
    endDate:Date,
    userId:String,
    prefix:[String],
    startDate:Date,
    endDate:Date,
):TradingOrderSummary
`;
const addParams = `
ordertype:Int!,
txntype:Int!,
stockcode:Int!,
cnt:Int!,
price:Float,
enddate:Date,
condid:Int,
txnsource:Int!,
userId:String
`;
const editParams = `
txnid:Int!,
cnt:Int!,
price:Float,
`;
const cancelParams = `
txnid:Int!
`;
const confirmParams = `
orderId: Int!
doneprice: Float!
donecnt: Int!
donedate: Date!
`;
export const mutations = `
tradingOrderAdd(${addParams}):TradingOrder,
tradingOrderEdit(${editParams}):TradingOrder,
tradingOrderCancel(${cancelParams}):TradingOrder,
tradingOrderConfirm(${confirmParams}):TradingOrder
`;
