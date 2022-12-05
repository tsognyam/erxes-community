export const types = `
  type Registerorder {
    _id: String!
    name: String
    createdAt:Date
    expiryDate:Date
    checked:Boolean
    typeId: String
  
    currentType: RegisterorderType
  }

  type RegisterorderType {
    _id: String!
    name: String
  }
`;
export const queries = `
  registerorders(typeId: String): [Registerorder]
  registerorderTypes: [RegisterorderType]
  registerordersTotalCount: Int
`;

const params = `
  name: String,
  expiryDate: Date,
  checked: Boolean,
  typeId:String
`;

export const mutations = `
  registerordersAdd(${params}): Registerorder
  registerordersRemove(_id: String!): JSON
  registerordersEdit(_id:String!, ${params}): Registerorder
  registerorderTypesAdd(name:String):RegisterorderType
  registerorderTypesRemove(_id: String!):JSON
  registerorderTypesEdit(_id: String!, name:String): RegisterorderType
`;
