import { Router } from 'express';
import MigrationService from '../service/migration.service';
import multer = require('multer');
import * as moment from 'moment';
import * as fs from 'fs';
const router = Router();
const migrationService = new MigrationService();
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const path = './data/uploads/migration';
    fs.mkdirSync(path, { recursive: true });
    cb(null, path);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix =
      moment().format('YYYY-MM-DD HH:mm:ss') +
      '-' +
      Math.round(Math.random() * 1e9);
    cb(null, file.originalname + '-' + uniqueSuffix);
  }
});
const upload = multer({ storage: storage });
router.post('/', upload.single('file'), async (req, res, next) => {
  migrationService
    .migration(req)
    .then(result => {
      res.json({
        status: 0,
        data: result
      });
    })
    .catch(error => {
      console.log(error);
      res.status(400).json(error.toString());
    });
});

export default router;
