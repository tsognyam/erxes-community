const list = `
  query listQuery($typeId: String) {
    nominals(typeId: $typeId) {
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

const listNominalTypes = `
  query listNominalTypeQuery{
    nominalTypes{
      _id
      name
    }
  }
`;

const totalCount = `
  query nominalsTotalCount{
    nominalsTotalCount
  }
`;

export default {
  list,
  totalCount,
  listNominalTypes
};
