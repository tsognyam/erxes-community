export const types = `
  type Trading {
    _id: String!
    name: String
  }
`;

export const queries = `
  tradings: [Trading]
  tradingsTotalCount: Int
`;

const params = `
  name: String!,
`;

export const mutations = `
  tradingsAdd(${params}): Trading
`;
