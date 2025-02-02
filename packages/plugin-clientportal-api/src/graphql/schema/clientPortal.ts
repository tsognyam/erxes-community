export const types = (cardAvailable, kbAvailable) => `
${
  cardAvailable
    ? `
   extend type Stage @key(fields: "_id") {
    _id: String! @external
  }
  extend type Task @key(fields: "_id") {
    _id: String! @external
  }
  extend type Ticket @key(fields: "_id") {
    _id: String! @external
  }
  extend type Deal @key(fields: "_id") {
    _id: String! @external
  }
   `
    : ''
}

${
  kbAvailable
    ? `
   extend type KnowledgeBaseTopic @key(fields: "_id") {
    _id: String! @external
  }

   extend type KnowledgeBaseArticle @key(fields: "_id") {
    _id: String! @external
  }
   `
    : ''
}

  type OTPConfig {
    content: String
    codeLength: Int
    smsTransporterType: String
    loginWithOTP: Boolean
    expireAfter: Int
  }

  type MailConfig {
    subject: String
    invitationContent : String
    registrationContent : String
  }

  type ManualVerificationConfig {
    userIds: [String]
    verifyCustomer: Boolean
    verifyCompany: Boolean
  }

  input OTPConfigInput {
    content: String
    codeLength: Int
    smsTransporterType: String
    loginWithOTP: Boolean
    expireAfter: Int
  }

  input MailConfigInput {
    subject: String
    invitationContent : String
    registrationContent : String
  }

  type ClientPortal {
    _id: String!
    name: String!
    description: String
    url: String
    logo: String
    icon: String
    headerHtml: String
    footerHtml: String

    domain: String
    dnsStatus: String
    messengerBrandCode: String
    knowledgeBaseLabel: String
    knowledgeBaseTopicId: String
    ticketLabel: String
    dealLabel: String
    taskPublicBoardId: String
    taskPublicPipelineId: String
    taskLabel: String
    taskStageId: String
    taskPipelineId: String
    taskBoardId: String
    ticketStageId: String
    ticketPipelineId: String
    ticketBoardId: String
    dealStageId: String
    dealPipelineId: String
    dealBoardId: String
    googleCredentials: JSON
    styles: Styles
    mobileResponsive: Boolean
  
    otpConfig: OTPConfig
    mailConfig: MailConfig
    manualVerificationConfig: ManualVerificationConfig

    kbToggle: Boolean,
    publicTaskToggle: Boolean,
    ticketToggle: Boolean,
    taskToggle: Boolean,
    dealToggle: Boolean,
  }

  type Styles {
    bodyColor: String
    headerColor: String
    footerColor: String
    helpColor: String
    backgroundColor: String
    activeTabColor: String
    baseColor: String
    headingColor: String
    linkColor: String
    linkHoverColor: String
    baseFont: String
    headingFont: String
    dividerColor: String
    primaryBtnColor: String
    secondaryBtnColor: String
  }

  input StylesParams {
    bodyColor: String
    headerColor: String
    footerColor: String
    helpColor: String
    backgroundColor: String
    activeTabColor: String
    baseColor: String
    headingColor: String
    linkColor: String
    linkHoverColor: String
    dividerColor: String
    primaryBtnColor: String
    secondaryBtnColor: String
    baseFont: String
    headingFont: String
  }
`;

export const queries = (cardAvailable, kbAvailable) => `
  clientPortalGetConfigs(page: Int, perPage: Int): [ClientPortal]
  clientPortalGetConfig(_id: String!): ClientPortal
  clientPortalGetConfigByDomain: ClientPortal
  clientPortalGetLast: ClientPortal
  clientPortalConfigsTotalCount: Int

  ${
    cardAvailable
      ? `
    clientPortalGetTaskStages: [Stage]
    clientPortalGetTasks(stageId: String!): [Task]
    clientPortalTickets: [Ticket]
    clientPortalTicket(_id: String!): Ticket
   `
      : ''
  }

  ${
    kbAvailable
      ? `
    clientPortalKnowledgeBaseTopicDetail(_id: String!): KnowledgeBaseTopic
    clientPortalKnowledgeBaseArticles(searchValue: String, categoryIds: [String], topicId: String): 
[KnowledgeBaseArticle]
   `
      : ''
  }
`;

export const mutations = cardAvailable => `
  clientPortalConfigUpdate (
    _id: String
    name: String
    description: String
    logo: String
    icon: String
    headerHtml: String
    footerHtml: String
    url: String
    domain: String
    messengerBrandCode: String
    knowledgeBaseLabel: String
    knowledgeBaseTopicId: String
    ticketLabel: String
    taskLabel: String
    dealLabel: String
    taskPublicBoardId: String
    taskPublicPipelineId: String
    taskStageId: String
    taskPipelineId: String
    taskBoardId: String
    ticketStageId: String
    ticketPipelineId: String
    ticketBoardId: String
    dealStageId: String
    dealPipelineId: String
    dealBoardId: String
    googleCredentials: JSON
    styles: StylesParams
    mobileResponsive: Boolean
    kbToggle: Boolean,
    publicTaskToggle: Boolean,
    ticketToggle: Boolean,
    dealToggle: Boolean,
    taskToggle: Boolean,

    otpConfig: OTPConfigInput
    mailConfig: MailConfigInput
    manualVerificationConfig: JSON
  ): ClientPortal

  clientPortalRemove (_id: String!): JSON

  ${
    cardAvailable
      ? `
      clientPortalCreateCard(
        type: String!
        stageId: String!
        subject: String!
        description: String
        priority: String,
        parentId: String,
        closeDate: Date
        startDate: Date
      ): JSON
      clientPortalCommentsAdd(type: String!, typeId: String!, content: String! userType: String!): ClientPortalComment
      clientPortalCommentsRemove(_id: String!): String
     `
      : ''
  }
`;
