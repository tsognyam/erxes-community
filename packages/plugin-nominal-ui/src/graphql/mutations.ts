const add = `
  mutation nominalsAdd($name: String!, $expiryDate: Date, $typeId:String) {
    nominalsAdd(name:$name, expiryDate: $expiryDate, typeId:$typeId) {
      name
      _id
      expiryDate
      typeId
    }
  }
`;

const remove = `
  mutation nominalsRemove($_id: String!){
    nominalsRemove(_id: $_id)
  }
  `;

const edit = `
  mutation nominalsEdit($_id: String!, $name:String, $expiryDate:Date, $checked:Boolean, $typeId:String){
    nominalsEdit(_id: $_id, name: $name, expiryDate:$expiryDate, checked:$checked, typeId:$typeId){
      _id
    }
  }
  `;

const addType = `
  mutation typesAdd($name: String!){
    nominalTypesAdd(name:$name){
      name
      _id
    }
  }
  `;

const removeType = `
  mutation typesRemove($_id:String!){
    nominalTypesRemove(_id:$_id)
  }
`;

const editType = `
  mutation typesEdit($_id: String!, $name:String){
    nominalTypesEdit(_id: $_id, name: $name){
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
