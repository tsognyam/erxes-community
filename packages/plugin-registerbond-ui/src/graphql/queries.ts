const list = `
  query listQuery($typeId: String) {
    registerbonds(typeId: $typeId) {
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

const listRegisterbondTypes = `
  query listRegisterbondTypeQuery{
    registerbondTypes{
      _id
      name
    }
  }
`;

const totalCount = `
  query registerbondsTotalCount{
    registerbondsTotalCount
  }
`;

export default {
  list,
  totalCount,
  listRegisterbondTypes
};
