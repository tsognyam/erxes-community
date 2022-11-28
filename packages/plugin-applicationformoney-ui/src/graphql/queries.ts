const list = `
  query primarytradesQuery {
    primarytrades {
      _id
      name
    }
  }
`;

const totalCount = `
  query primarytradesTotalCountQuery {
    primarytradesTotalCount
  }
`;

export default {
  list,
  totalCount
};
