const list = `
  query tradingsQuery {
    tradings {
      _id
      name
    }
  }
`;

const totalCount = `
  query tradingsTotalCountQuery {
    tradingsTotalCount
  }
`;

export const commonFields = `
  name
  kind
  code
  languageCode
  leadData
  formId
  tagIds
  form {
    _id
    title
    code
    description
    type
    buttonText
    numberOfPages
    createdDate
    createdUserId
    createdUser {
      _id
      details {
        avatar
        fullName
        position
      }
    }
  }
  isActive

  visibility
  departmentIds
`;

export default {
  list,
  totalCount,
  commonFields
};
