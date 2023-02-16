const tradingCustFeeList = `
query TradingCustFeeGetList($userId: String) {
  tradingCustFeeGetList(userId: $userId) {
    count
    total
    values {
      descr
      id
      name
      name2
      sidetype
      status
      stocktypeId
      updatedby
      updateddate
      user
      userId
      value
    }
  }
}
`;
export default { tradingCustFeeList };
