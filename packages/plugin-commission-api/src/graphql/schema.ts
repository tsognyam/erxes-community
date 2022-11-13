export const types = `
  type Commission {
    _id: String!
    name: String
  }
`;

export const queries = `
  commissions: [Commission]
  commissionsTotalCount: Int
`;

const params = `
  name: String!,
`;

export const mutations = `
  commissionsAdd(${params}): Commission
`;
