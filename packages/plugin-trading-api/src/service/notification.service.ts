import HttpService from './request/http.service';

import Helper from '../middleware/helper.service';
import BaseConst from '../constants/base';
import { sendCoreMessage, sendNotification } from '../messageBroker';

interface sendParams {
  subdomain: string;
  subject: string;
  content: string;
  action: string;
  data: string;
  userId: string[];
  createdUserId: string;
}
export default class NotificationService {
  NOTIFICATION_URL: any;
  http: HttpService;
  constructor() {
    this.NOTIFICATION_URL =
      process.env.NOTIFICATION_URL || 'http://notification';
    this.http = new HttpService(this.NOTIFICATION_URL);
  }

  send = async (params: sendParams) => {
    sendNotification(params.subdomain, {
      createdUser: params.createdUserId,
      title: params.subject,
      notifType: 'plugin',
      action: params.action,
      content: params.content,
      link: `/erxes-plugin-trading`,
      receivers: params.userId
    });

    sendCoreMessage({
      subdomain: params.subdomain,
      action: 'sendMobileNotification',
      data: {
        title: params.subject,
        body: params.data,
        receivers: params.userId
      }
    });

    return 'Success';
  };
}
