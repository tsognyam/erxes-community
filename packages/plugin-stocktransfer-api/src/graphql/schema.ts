export const types = `
  type StockTransfer {
    _id: String!
    name: String
  }
`;

export const queries = `
  stockTransfers: [StockTransfer]
  stockTransfersTotalCount: Int
`;

const params = `
  name: String!,
`;

export const mutations = `
stockTransfersAdd(${params}): StockTransfer
`;
