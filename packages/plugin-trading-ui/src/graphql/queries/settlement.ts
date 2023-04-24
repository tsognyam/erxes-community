const tradingSettlements = `
query TradingSettlements($page: Int!, $perPage: Int!, $startDate: Date, $endDate: Date,$userId:String) {
    tradingSettlements(page: $page, perPage: $perPage, startDate: $startDate, endDate: $endDate,userId:$userId) {
      values {
        buyObligation
        buyQuantity
        clientPrefix
        clientSuffix
        executedDate
        frcFee
        msccFee
        mseFee
        obligation
        quantity
        settlementDate
        status
        statusDescription
        tradeDate
        userId
      }
      total
      count
    }
  }
`;
export default {
  tradingSettlements
};
