const tradingWalletCharge = `
mutation TradingWalletCharge($amount: Float!, $walletId: Int!) {
  tradingWalletCharge(amount: $amount, walletId: $walletId) {
    accountName
    accountNo
    amount
    bank
    contAccountNo
    createUserId
    createdAt
    currencyCode
    dater
    description
    id
    jrno
    message
    oldDescription
    order
    orderId
    recAccountNo
    status
    txnSign
    type
    updatedAt
    updatedUserId
    wallet
    walletId
    withdraw
  }
}
`;
export default {
  tradingWalletCharge
};
