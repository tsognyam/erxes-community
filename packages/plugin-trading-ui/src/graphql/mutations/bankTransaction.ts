const tradingEditBankTransactionWalletId = `mutation tradingEditBankTransactionWalletId($id: Int!, $userId: String!) {
    tradingEditBankTransactionWalletId(id: $id, userId: $userId) {
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
  tradingEditBankTransactionWalletId
};
