import axios from 'axios';
// const errorHandler = require('../../exception/error-handler');
// const errorAPI = require('../../exception/error-api');
import Helper from '../../middleware/helper.service';
import soap from 'soap';
import ErrorException from '../../exception/error-exception';
const { logger } = require('../../middleware/logger');
import * as https from 'https';
export default class HttpService {
  static METHOD_POST = 'POST';
  static METHOD_GET = 'GET';
  static METHOD_PUT = 'PUT';
  static METHOD_DELETE = 'DELETE';
  _baseUrl;
  constructor(baseUrl) {
    this._baseUrl = baseUrl;
  }

  async request(
    url,
    params = null,
    method = HttpService.METHOD_GET,
    headers = null
  ) {
    let option;
    // axios.post(this._baseUrl, JSON.stringify(params))
    if (
      method == HttpService.METHOD_GET ||
      method == HttpService.METHOD_DELETE
    ) {
      option = {
        method: method,
        url: this._baseUrl + url,
        params: params,
        headers: headers,
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
      };
    } else {
      option = {
        method: method,
        url: this._baseUrl + url,
        data: params,
        headers: headers,
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
      };
    }
    return await axios(option).catch(error => {
      //logger.error(error);
      if (error.response) {
        let errMsg = '',
          errCode = 0;
        if (error.response.data.errorMsg != undefined)
          errMsg = error.response.data.errorMsg;
        else if (error.response.data.message != undefined)
          errMsg = error.response.data.message;
        errCode = error.response.data.code;
        if (errCode == undefined) errCode = error.response.status;
        if (errMsg == '') errMsg = error.response.statusText;
        throw new ErrorException({
          code: errCode,
          message: errMsg
        });
      } else if (error.request) {
        console.log('error.request', error.request);
        throw new ErrorException({
          code: 500,
          message: 'error API'
        });
      } else {
        throw new ErrorException({
          code: 500,
          message: error.message
        });
      }
    });
  }
  async requestSOAP(func, data) {
    return new Promise((resolve, reject) => {
      soap.createClient(this._baseUrl, function(err, client) {
        if (client != undefined) {
          if (func in client && typeof client[func] === 'function') {
            client[func](data, function(err, result) {
              resolve(result);
            });
          }
        } else {
          resolve(undefined);
        }
      });
    });
  }

  _getPath() {}

  _getMethod() {}

  _getOptions() {}

  _validate() {}

  _getParameters() {}

  _validateResponse() {}
}
