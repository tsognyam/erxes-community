import HttpService from './request/http.service';

import Helper from '../middleware/helper.service';
import BaseConst from '../constants/base';

export default class NotificationService {
  NOTIFICATION_URL: any;
  http: HttpService;
  constructor() {
    this.NOTIFICATION_URL =
      process.env.NOTIFICATION_URL || 'http://notification';
    this.http = new HttpService(this.NOTIFICATION_URL);
  }

  send = async params => {
    let data: any = {
      push: {
        categoryKey: params.key,
        categoryType: params.type,
        sender: 1,
        uuid: params.uuid,
        subject: params.subject,
        content: params.content,
        body: params.data,
        application: 'app'
      },
      force: true
    };

    let notificationResult = await this.http.request(
      '/v1/notification',
      data,
      HttpService.METHOD_POST
    );

    return notificationResult.data;
  };
}
