const list = `
  query listQuery($typeId: String) {
    registerorders(typeId: $typeId) {
      _id
      name
      expiryDate
      createdAt
      checked
      typeId
      currentType{
        _id
        name
      }
    }
  }
`;

const listRegisterorderTypes = `
  query listRegisterorderTypeQuery{
    registerorderTypes{
      _id
      name
    }
  }
`;

const totalCount = `
  query registerordersTotalCount{
    registerordersTotalCount
  }
`;

export default {
  list,
  totalCount,
  listRegisterorderTypes
};
