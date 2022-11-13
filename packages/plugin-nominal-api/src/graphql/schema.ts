export const types = `
  type Nominal {
    _id: String!
    name: String
    createdAt:Date
    expiryDate:Date
    checked:Boolean
    typeId: String
  
    currentType: NominalType
  }

  type NominalType {
    _id: String!
    name: String
  }
`;
export const queries = `
  nominals(typeId: String): [Nominal]
  nominalTypes: [NominalType]
  nominalsTotalCount: Int
`;

const params = `
  name: String,
  expiryDate: Date,
  checked: Boolean,
  typeId:String
`;

export const mutations = `
  nominalsAdd(${params}): Nominal
  nominalsRemove(_id: String!): JSON
  nominalsEdit(_id:String!, ${params}): Nominal
  nominalTypesAdd(name:String):NominalType
  nominalTypesRemove(_id: String!):JSON
  nominalTypesEdit(_id: String!, name:String): NominalType
`;
