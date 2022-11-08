export const types = `
  type PrimaryTrade {
    _id: String!
    name: String
  }
`;

export const queries = `
  primaryTrades: [PrimaryTrade]
  primaryTradesTotalCount: Int
`;

const params = `
  name: String!,
`;

export const mutations = `
  primaryTradesAdd(${params}): PrimaryTrade
`;
