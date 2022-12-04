const add = `
  mutation automatordersAdd($name: String!, $expiryDate: Date, $typeId:String) {
    automatordersAdd(name:$name, expiryDate: $expiryDate, typeId:$typeId) {
      name
      _id
      expiryDate
      typeId
    }
  }
`;

const remove = `
  mutation automatordersRemove($_id: String!){
    automatordersRemove(_id: $_id)
  }
  `;

const edit = `
  mutation automatordersEdit($_id: String!, $name:String, $expiryDate:Date, $checked:Boolean, $typeId:String){
    automatordersEdit(_id: $_id, name: $name, expiryDate:$expiryDate, checked:$checked, typeId:$typeId){
      _id
    }
  }
  `;

const addType = `
  mutation typesAdd($name: String!){
    automatorderTypesAdd(name:$name){
      name
      _id
    }
  }
  `;

const removeType = `
  mutation typesRemove($_id:String!){
    automatorderTypesRemove(_id:$_id)
  }
`;

const editType = `
  mutation typesEdit($_id: String!, $name:String){
    automatorderTypesEdit(_id: $_id, name: $name){
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
