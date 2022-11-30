import { commonFields } from './queries';

const commonParamDefs = `$name: String!`;
const commonParams = `name: $name`;

const add = `
  mutation tradingsAdd(${commonParamDefs}) {
    tradingsAdd(${commonParams}) {
      _id
    }
  }
`;

const commonFormParamsDef = `
  $name: String!,
  $brandId: String!,
  $channelIds: [String]
  $formId: String!,
  $languageCode: String,
  $leadData: IntegrationLeadData!
  $visibility: String,
  $departmentIds: [String],
`;

const commonFormParams = `
  name: $name,
  brandId: $brandId,
  channelIds: $channelIds,
  formId: $formId,
  languageCode: $languageCode,
  leadData: $leadData,
  visibility: $visibility,
  departmentIds: $departmentIds,
`;

const integrationsCreateLeadIntegration = `
  mutation integrationsCreateLeadIntegration(${commonFormParamsDef}) {
    integrationsCreateLeadIntegration(${commonFormParams}) {
      _id
    }
  }
`;

const integrationsEditLeadIntegration = `
  mutation integrationsEditLeadIntegration($_id: String!, ${commonFormParamsDef}) {
    integrationsEditLeadIntegration(_id: $_id, ${commonFormParams}) {
      _id
      ${commonFields}
    }
  }
`;

export default {
  add,
  integrationsEditLeadIntegration,
  integrationsCreateLeadIntegration
};
