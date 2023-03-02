import {
  attachmentInput,
  attachmentType
} from '@erxes/api-utils/src/commonTypeDefs';
export const types = `
${attachmentType}
${attachmentInput}
`;
export const queries = `

`;
export const mutations = `tradingDataMigrate(
type: String,
attachment:AttachmentInput
):JSON`;
