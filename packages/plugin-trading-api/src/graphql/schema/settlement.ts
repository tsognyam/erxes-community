export const types = `
type TradingSettlement {
    userId:String,
    tradeDate:Date,
    settlementDate:Date,
    clientPrefix:String,
    clientSuffix:String,
    buyQuantity:Int,
    buyObligation:Float,
    quantity:Int,
    obligation:Float,
    mseFee:Float,
    msccFee:Float,
    frcFee:Float,
    status:Int,
    statusDescription:String,
    executedDate:Date
}
type TradingSettlementList {
    total:Int,
    count:Int,
    values:[TradingSettlement]
}
`;
const inputParams = `
page:Int!,
perPage:Int!,
startDate:Date,
endDate:Date`;
export const queries = `
tradingSettlements(${inputParams}):[TradingSettlementList]
`;
