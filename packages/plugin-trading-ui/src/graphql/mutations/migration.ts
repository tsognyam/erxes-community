const dataMigrate = `
mutation tradingDataMigrate($attachment: AttachmentInput, $type: String) {
    tradingDataMigrate(attachment: $attachment, type: $type)
  }
`;
export default {
  dataMigrate
};
