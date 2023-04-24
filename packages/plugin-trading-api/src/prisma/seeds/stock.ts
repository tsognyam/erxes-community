const stock = require('../../src/initialData/stock.json');
let data: any = [];
export const migrationStock = () => {
  let stockList = stock.db_securities;

  stockList.forEach(element => {
    let el: any = {};
    el.stockcode = parseInt(element.s_code);
    el.symbol = element.s_mit.split('-')[0];
    el.stocktypeId = 1;
    el.stockname = element.s_name;
    el.stockprice = parseFloat(element.s_nerlesen);
    el.minprice = parseFloat(element.s_nerlesen);
    el.maxprice = parseFloat(element.s_nerlesen);
    el.openprice = parseFloat(element.s_nerlesen);
    el.closeprice = parseFloat(element.s_nerlesen);
    el.intrate = 0;
    el.status = element.s_isactive;
    if (element.hasOwnProperty('s_isin')) el.no = element.s_isin;
    else el.no = '';
    el.cnt = parseInt(element.s_gargasan);
    el.ipo = 1;
    el.externalid = element.s_mit;
    el.stockfee = 0.01;
    el.exchangeid = 1;
    if (element.s_b_begindate != 'NULL' && element.s_b_enddate != 'NULL') {
      el.startdate = new Date(element.s_b_begindate);
      el.enddate = new Date(element.s_b_enddate);
    }
    data.push(el);
  });
  return data;
};
