export default class Helper {
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
