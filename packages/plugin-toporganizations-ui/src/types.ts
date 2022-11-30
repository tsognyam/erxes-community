export type IntegrationMutationVariables = {
  name: string;
  channelIds?: string[];
  visibility?: string;
  departmentIds?: string[];
  data?: any;
};

export interface IGeneralData {
  registryNumber?: string;
  companyName?: string;
  phoneNumber?: string;
  email?: string;
  establishedDate?: any;
  registeredDate?: any;
  address?: string;
  stockType?: string;
  businessDirection?: string;
  activityDirection?: string;
  actionField?: string;
  operationalStatus?: string;
  isin?: string;
  totalShares?: number;
  issuedShares?: number;
  marketValue?: number;
  weeks?: number;
}

export type AddIntegrationMutationVariables = {
  general: IGeneralData;
  languageCode: string;
  formId: string;
} & IntegrationMutationVariables;

export type AddIntegrationMutationResponse = {
  addRegisterMutation: (params: {
    variables: AddIntegrationMutationVariables;
  }) => Promise<any>;
};
