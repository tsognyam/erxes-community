import * as csv from 'csv-parser';
import * as fs from 'fs';
import OrderService from './order.service';
import StockRepository from '../repository/stock.repository';
import UserMCSDAccountRepository from '../repository/user/user.mcsd.repository';
import {
  OrderTxnType,
  TxnSourceConst,
  OrderType,
  OrderCondition
} from '../constants/stock';
export default class MigrationService {
  private orderService: OrderService;
  private stockRepository: StockRepository;
  private userMCSDAccountRepository: UserMCSDAccountRepository;
  constructor() {
    this.orderService = new OrderService();
    this.stockRepository = new StockRepository();
    this.userMCSDAccountRepository = new UserMCSDAccountRepository();
  }
  getCsvData = async params => {
    return new Promise(function(resolve, reject) {
      var fetchData: any = [];
      fs.createReadStream('./data/uploads/migration/' + params.file.filename)
        .pipe(csv({ separator: ',' }))
        .on('data', row => {
          fetchData.push(row);
        })
        .on('end', () => {
          resolve(fetchData);
        })
        .on('error', reject);
    });
  };
  migration = async params => {
    let csvData = await this.getCsvData(params);
    if (params.body.type == 'walletBalance')
      await this.migrationWalletBalance(csvData);
    else if (params.body.type == 'order') await this.migrationOrder(csvData);
  };
  migrationWalletBalance = async data => {};
  migrationOrder = async data => {
    let i = 0;
    for (i = 0; i < data.length; i++) {
      if (data[i].statusname != 'Биелсэн') continue;
      let stock = await this.stockRepository.findFirst({
        symbol: data[i].symbol
      });
      if (!stock) continue;
      let userMCSD = await this.userMCSDAccountRepository.findFirst({
        prefix: data[i].mit_prefix
      });
      if (!userMCSD) continue;
      let orderExtraParams: any = {
        condid:
          data[i].timeinforce == 'GTC'
            ? OrderCondition.GTC
            : data[i].timeinforce == 'Day'
            ? OrderCondition.Day
            : OrderCondition.GTD
      };
      if (orderExtraParams.condid == OrderCondition.GTD)
        orderExtraParams.enddate = new Date(data[i].timeinforce);
      let orderParams = {
        stockcode: stock.stockcode,
        userId: userMCSD.userId,
        txntype:
          data[i].buysell == 'buy' ? OrderTxnType.Buy : OrderTxnType.Sell,
        ordertype: OrderType.LIMIT,
        cnt: parseFloat(data[i].cumquantity),
        price: parseFloat(data[i].price),
        txndate: new Date(data[i].createddate),
        txnsource: TxnSourceConst.Broker,
        orderno: data[i].order_id,
        ...orderExtraParams
      };
      await this.orderService.create(orderParams, false);
      console.log('Added order');
    }
  };
  migrationTransaction = async () => {};
}
