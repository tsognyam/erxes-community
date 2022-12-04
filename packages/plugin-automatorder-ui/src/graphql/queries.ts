const list = `
  query listQuery($typeId: String) {
    automatorders(typeId: $typeId) {
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

const listAutomatorderTypes = `
  query listAutomatorderTypeQuery{
    automatorderTypes{
      _id
      name
    }
  }
`;

const totalCount = `
  query automatordersTotalCount{
    automatordersTotalCount
  }
`;

export default {
  list,
  totalCount,
  listAutomatorderTypes
};
