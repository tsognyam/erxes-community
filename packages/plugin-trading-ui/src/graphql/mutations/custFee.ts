const tradingCustFeeUpdate = `mutation TradingCustFeeUpdate($id: Int!, $value: Float) {
    tradingCustFeeUpdate(id: $id, value: $value) {
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
  `;
export default {
  tradingCustFeeUpdate
};
