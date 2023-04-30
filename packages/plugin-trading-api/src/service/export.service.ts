import * as fs from 'fs';
import { stringify } from 'csv-stringify';
const path = './data/downloads/csv';
export default class ExportService {
  arrayToCsv = async (data, fileName, columns) => {
    const options = {
      delimiter: ',',
      relax_column_count: true,
      skip_empty_lines: true,
      header: true,
      columns: columns
    };
    const writableStream = fs.createWriteStream(path + '/' + fileName, {
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
      console.log(row);
      transform.write(row);
    });

    transform.end();
  };
}
