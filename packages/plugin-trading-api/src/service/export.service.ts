import * as fs from 'fs';
import { stringify } from 'csv-stringify';
const path = './data/downloads/csv';
export default class ExportService {
  arrayToCsv = async (data, fileName, columns) => {
    stringify(data, { header: true, columns: columns }, function(err, output) {
      fs.mkdirSync(path, { recursive: true });
      if (err) throw err;
      fs.writeFileSync(path + '/' + fileName, output);
      console.log('CSV file generated successfully!');
    });
  };
}
