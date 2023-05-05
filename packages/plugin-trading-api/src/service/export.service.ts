import * as fs from 'fs';
import { stringify } from 'csv-stringify';
import { Readable } from 'stream';
import * as moment from 'moment';
import StockTransactionRepository from '../repository/wallet/stock.transaction.repository';
import TransactionRepository from '../repository/wallet/transaction.repository';
const path = `./data/downloads/csv`;
let stockTransactionRepository = new StockTransactionRepository();
let transactionRepository = new TransactionRepository();
export default class ExportService {
  pageSize: number;
  constructor() {
    this.pageSize = 1000;
  }
  arrayToCsvWriteFile = async (data, fileName, columns) => {
    const options = {
      delimiter: ',',
      relax_column_count: true,
      skip_empty_lines: true,
      header: true,
      columns: columns
    };
    fs.mkdirSync(path, { recursive: true });
    const writableStream = fs.createWriteStream(path + `/${fileName}`, {
      encoding: 'utf8'
    });
    const transform = stringify(options);
    transform.on('readable', () => {
      let chunk;
      while ((chunk = transform.read()) !== null) {
        writableStream.write(chunk);
      }
    });
    transform.on('error', err => {
      console.error(err);
    });

    transform.on('finish', () => {
      console.log('CSV file has been created!');
      writableStream.end();
    });

    data.forEach(row => {
      transform.write(row);
    });

    transform.end();
  };
  exportStockTransaction = async (params, columns, res) => {
    const setValues = (row: any) => {
      row.type =
        row.type == 1
          ? 'Авах'
          : row.type == 2
          ? 'Зарах'
          : row.type == 3
          ? 'Авах'
          : row.type == 4
          ? 'Зарах'
          : '';
      row.dater = moment(row.dater).format('YYYY-MM-DD HH:mm:ss');
      row.cretedAt = moment(row.cretedAt).format('YYYY-MM-DD HH:mm:ss');
      row.income = parseFloat(row.income);
      row.outcome = parseFloat(row.outcome);
      row.expectedIncome = parseFloat(row.expectedIncome);
      row.expectedOutcome = parseFloat(row.expectedOutcome);
      row.price = parseFloat(row.price);
      row.fee = parseFloat(row.fee);
      return row;
    };
    const options = {
      delimiter: ',',
      relax_column_count: true,
      skip_empty_lines: true,
      header: true,
      columns
    };
    const transform = stringify(options);
    const stream = new Readable({ objectMode: true });
    stream._read = () => {};

    let offset = 0;
    let rows = [];
    let hasMoreRows = true;
    while (hasMoreRows) {
      let updatedParams = {
        startDate: params.startDate,
        endDate: params.endDate,
        walletId: params.walletId,
        userId: params.userId,
        stockcode: params.stockcode,
        take: this.pageSize,
        skip: offset
      };
      const {
        values
      } = await stockTransactionRepository.stockTransactionStatement(
        updatedParams
      );
      hasMoreRows = values.length === this.pageSize;
      offset += this.pageSize;
      rows = rows.concat(values);
      if (rows.length >= this.pageSize) {
        rows.forEach((row: any) => {
          row = setValues(row);
          stream.push(row);
        });
        rows = [];
      }
    }
    if (rows.length > 0) {
      rows.forEach((row: any) => {
        row = setValues(row);
        stream.push(row);
      });
    }
    stream.push(null);
    stream.pipe(transform).pipe(res);

    return transform;
  };
  exportTransaction = async (params, columns, res) => {
    const setValues = (row: any) => {
      row.type =
        row.type == 1 || row.type == 3
          ? 'Орлого'
          : row.type == 2 || row.type == 4
          ? 'Зарлага'
          : '';
      row.dater = moment(row.dater).format('YYYY-MM-DD HH:mm:ss');
      row.cretedAt = moment(row.cretedAt).format('YYYY-MM-DD HH:mm:ss');
      row.income = parseFloat(row.income);
      row.outcome = parseFloat(row.outcome);
      row.expectedIncome = parseFloat(row.expectedIncome);
      row.expectedOutcome = parseFloat(row.expectedOutcome);
      return row;
    };
    const options = {
      delimiter: ',',
      relax_column_count: true,
      skip_empty_lines: true,
      header: true,
      columns
    };
    const transform = stringify(options);
    const stream = new Readable({ objectMode: true });
    stream._read = () => {};

    let offset = 0;
    let rows = [];
    let hasMoreRows = true;
    while (hasMoreRows) {
      let updatedParams = {
        startDate: params.startDate,
        endDate: params.endDate,
        walletId: params.walletId,
        userId: params.userId,
        take: this.pageSize,
        skip: offset
      };
      const { values } = await transactionRepository.transactionStatement(
        updatedParams
      );
      hasMoreRows = values.length === this.pageSize;
      offset += this.pageSize;
      rows = rows.concat(values);
      if (rows.length >= this.pageSize) {
        rows.forEach((row: any) => {
          row = setValues(row);
          stream.push(row);
        });
        rows = [];
      }
    }
    if (rows.length > 0) {
      rows.forEach((row: any) => {
        row = setValues(row);
        stream.push(row);
      });
    }
    stream.push(null);
    stream.pipe(transform).pipe(res);

    return transform;
  };
}
