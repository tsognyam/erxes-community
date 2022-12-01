export const types = `
  type Registerbond {
    _id: String!
    name: String
    createdAt:Date
    expiryDate:Date
    checked:Boolean
    typeId: String
  
    currentType: RegisterbondType
  }

  type RegisterbondType {
    _id: String!
    name: String
  }
`;
export const queries = `
  registerbonds(typeId: String): [Registerbond]
  registerbondTypes: [RegisterbondType]
  registerbondsTotalCount: Int
`;

const params = `
  name: String,
  expiryDate: Date,
  checked: Boolean,
  typeId:String
`;

export const mutations = `
  registerbondsAdd(${params}): Registerbond
  registerbondsRemove(_id: String!): JSON
  registerbondsEdit(_id:String!, ${params}): Registerbond
  registerbondTypesAdd(name:String):RegisterbondType
  registerbondTypesRemove(_id: String!):JSON
  registerbondTypesEdit(_id: String!, name:String): RegisterbondType
`;
