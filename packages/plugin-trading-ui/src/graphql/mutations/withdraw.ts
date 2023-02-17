const tradingWithdrawCreate = `
mutation TradingWithdrawCreate($amount: Float!, $type: Int!, $walletId: Int!, $description: String) {
  tradingWithdrawCreate(amount: $amount, type: $type, walletId: $walletId, description: $description) {
    amount
    bankTransactionId
    createdAt
    createdUserId
    dater
    description
    feeAmount
    id
    status
    type
    updatedAt
    updatedUserId
    userBankAccountId
    walletId
  }
}
`;
const tradingWithdrawConfirm = `
mutation TradingWithdrawConfirm($confirm: Int, $requestId: Int) {
  tradingWithdrawConfirm(confirm: $confirm, requestId: $requestId) {
    amount
    bankTransactionId
    createdAt
    createdUserId
    dater
    description
    feeAmount
    firstName
    id
    lastName
    status
    type
    updatedAt
    updatedUserId
    userBankAccountId
    wallet
    walletId
  }
}
`;
const tradingWithdrawCancel = `
mutation TradingWithdrawCancel($requestId: Int!, $userId: String!) {
  tradingWithdrawCancel(requestId: $requestId, userId: $userId)
}
`;
export default {
  tradingWithdrawCreate,
  tradingWithdrawConfirm,
  tradingWithdrawCancel
};
