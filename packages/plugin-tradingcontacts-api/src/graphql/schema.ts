/**
 * This is for defining GraphQL schema
 */

export const types = `
  type Tradingcontacts {
    _id: String!
    name: String
  }
`;
export const queries = `
  tradingcontactss(typeId: String): [Tradingcontacts]
`;

const params = `
  name: String,
`;

export const mutations = `
  tradingcontactssAdd(${params}): Tradingcontacts
`;
