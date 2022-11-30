/**
 * This is for defining GraphQL schema
 */

export const types = `
  type Toporganizations {
    _id: String!
    name: String
  }
`;
export const queries = `
  toporganizationss(typeId: String): [Toporganizations]
`;

const params = `
  name: String,
`;

export const mutations = `
  toporganizationssAdd(${params}): Toporganizations
`;
