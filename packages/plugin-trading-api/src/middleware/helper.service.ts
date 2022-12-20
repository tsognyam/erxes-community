// const Redis = require('../../redis');
import SystemRepository from '../repository/system.repository';
// let redis = new Redis();
export default class Helper {
  static async getValueR(name) {
    // return await redis.getValueR(name);
    let res = await SystemRepository.get().getbyName(name);
    let value = null;
    if (res.length != 0) {
      value = res[0].value;
    }

    return value as any;
  }

  static async setValueR(name, value) {
    // return await redis.setValueR(name, value);
  }

  static async getValue(name) {
    let res = await SystemRepository.get().getbyName(name);
    let value = null;
    if (res.length != 0) {
      value = res[0].value;
    }

    return value as any;
  }
  static dateToString(date, format = false) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    if (month < 10) {
      month = '0' + month;
    }
    let day = date.getDate();
    if (day < 10) {
      day = '0' + day;
    }

    if (format) {
      return `${year}-${month}-${day}`;
    }

    let res = '';
    res += year;
    res += month;
    res += day;
    return res;
  }
}