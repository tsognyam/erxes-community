import * as csv from 'csv-parser';
import * as fs from 'fs';
import OrderService from './order.service';
import StockRepository from '../repository/stock.repository';
export default class MigrationService {
  private orderService: OrderService;
  private stockRepository: StockRepository;
  constructor() {
    this.orderService = new OrderService();
    this.stockRepository = new StockRepository();
  }
  getCsvData = async params => {
    return new Promise(function(resolve, reject) {
      var fetchData: any = [];
      fs.createReadStream('./data/uploads/migration/' + params.file.filename)
        .pipe(csv({ separator: ';' }))
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
    console.log(params.body.type);
    let csvData = await this.getCsvData(params);
    if (params.body.type == 'walletBalance')
      await this.migrationWalletBalance(csvData);
    else if (params.body.type == 'order') await this.migrationOrder(csvData);
  };
  migrationWalletBalance = async data => {};
  migrationOrder = async (data, live = false) => {
    console.log(data);
    let i = 0;
    for (i = 0; i < data.length; i++) {
      let stock = await this.stockRepository.findUnique({
        symbol: data[i].symbol
      });
      if (!stock) continue;
      console.log('stock', stock);
    }
    // await this.orderService.create({

    // });
  };
  migrationTransaction = async () => {};
}
