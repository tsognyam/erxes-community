const commonParamDefs = `$name: String!`;
const commonParams = `name: $name`;

const add = `
  mutation primarytradesAdd(${commonParamDefs}) {
    primarytradesAdd(${commonParams}) {
      _id
    }
  }
`;

export default {
  add
};
