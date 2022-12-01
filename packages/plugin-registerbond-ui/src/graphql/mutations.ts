const add = `
  mutation registerbondsAdd($name: String!, $expiryDate: Date, $typeId:String) {
    registerbondsAdd(name:$name, expiryDate: $expiryDate, typeId:$typeId) {
      name
      _id
      expiryDate
      typeId
    }
  }
`;

const remove = `
  mutation registerbondsRemove($_id: String!){
    registerbondsRemove(_id: $_id)
  }
  `;

const edit = `
  mutation registerbondsEdit($_id: String!, $name:String, $expiryDate:Date, $checked:Boolean, $typeId:String){
    registerbondsEdit(_id: $_id, name: $name, expiryDate:$expiryDate, checked:$checked, typeId:$typeId){
      _id
    }
  }
  `;

const addType = `
  mutation typesAdd($name: String!){
    registerbondTypesAdd(name:$name){
      name
      _id
    }
  }
  `;

const removeType = `
  mutation typesRemove($_id:String!){
    registerbondTypesRemove(_id:$_id)
  }
`;

const editType = `
  mutation typesEdit($_id: String!, $name:String){
    registerbondTypesEdit(_id: $_id, name: $name){
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
