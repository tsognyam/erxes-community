/**
 * This is for defining GraphQL schema
 */

export const types = `
  type Applicationformoney {
    _id: String!
    name: String
  }
`;
export const queries = `
  applicationformoneys(typeId: String): [Applicationformoney]
`;

const params = `
  name: String,
`;

export const mutations = `
  applicationformoneysAdd(${params}): Applicationformoney
`;
