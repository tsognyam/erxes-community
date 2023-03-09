import { IContext } from '../../../connectionResolver';
import {
  attachmentInput,
  attachmentType
} from '@erxes/api-utils/src/commonTypeDefs';
import {
  checkPermission,
  requireLogin
} from '@erxes/api-utils/src/permissions';
import MigrationService from '../../../service/migration.service';
import { generateAttachmentUrl, getEnv } from '@erxes/api-utils/src/core';
import axios from 'axios';
import * as fs from 'fs';
let migrationService = new MigrationService();
const MigrationMutations = {
  tradingDataMigrate: async (
    _root: any,
    params: any,
    { user, models, subdomain, res }: IContext
  ) => {
    console.log(res);
    console.log(subdomain);
    const DOMAIN = getEnv({ name: 'REACT' });
    const file = generateAttachmentUrl(params.attachment.url);
    console.log(params);
    console.log(file);
    // axios({
    //   method: "get",
    //   url: file,
    //   responseType: "stream"
    // }).then(function (response) {
    //   response.data.pipe(fs.createWriteStream("/data/walletBalance.csv"));
    // });
    let data = {};
    // if (params.type == 'walletBalance')
    //   data = await migrationService.migrationWalletBalance(params);
    return data;
  }
};
export default MigrationMutations;
