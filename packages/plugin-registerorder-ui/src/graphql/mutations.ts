const add = `
  mutation registerordersAdd($name: String!, $expiryDate: Date, $typeId:String) {
    registerordersAdd(name:$name, expiryDate: $expiryDate, typeId:$typeId) {
      name
      _id
      expiryDate
      typeId
    }
  }
`;

const remove = `
  mutation registerordersRemove($_id: String!){
    registerordersRemove(_id: $_id)
  }
  `;

const edit = `
  mutation registerordersEdit($_id: String!, $name:String, $expiryDate:Date, $checked:Boolean, $typeId:String){
    registerordersEdit(_id: $_id, name: $name, expiryDate:$expiryDate, checked:$checked, typeId:$typeId){
      _id
    }
  }
  `;

const addType = `
  mutation typesAdd($name: String!){
    registerorderTypesAdd(name:$name){
      name
      _id
    }
  }
  `;

const removeType = `
  mutation typesRemove($_id:String!){
    registerorderTypesRemove(_id:$_id)
  }
`;

const editType = `
  mutation typesEdit($_id: String!, $name:String){
    registerorderTypesEdit(_id: $_id, name: $name){
      _id
    }
  }
`;

export default {
  add,
  remove,
  edit,
  addType,
  removeType,
  editType
};
