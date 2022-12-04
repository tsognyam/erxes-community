export const types = `
  type Automatorder {
    _id: String!
    name: String
    createdAt:Date
    expiryDate:Date
    checked:Boolean
    typeId: String
  
    currentType: AutomatorderType
  }

  type AutomatorderType {
    _id: String!
    name: String
  }
`;
export const queries = `
  automatorders(typeId: String): [Automatorder]
  automatorderTypes: [AutomatorderType]
  automatordersTotalCount: Int
`;

const params = `
  name: String,
  expiryDate: Date,
  checked: Boolean,
  typeId:String
`;

export const mutations = `
  automatordersAdd(${params}): Automatorder
  automatordersRemove(_id: String!): JSON
  automatordersEdit(_id:String!, ${params}): Automatorder
  automatorderTypesAdd(name:String):AutomatorderType
  automatorderTypesRemove(_id: String!):JSON
  automatorderTypesEdit(_id: String!, name:String): AutomatorderType
`;
