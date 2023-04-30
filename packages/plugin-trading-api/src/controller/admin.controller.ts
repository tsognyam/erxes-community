import { Router } from 'express';
import AdminService from '../service/admin.service';
import multer = require('multer');
import { getSubdomain } from '@erxes/api-utils/src/core';
import * as fs from 'fs';
const upload = multer({ dest: './data/uploads' });
const router = Router();
const adminService = new AdminService();
router.post(
  '/upload/contract-note',
  upload.single('contract-note'),
  async (req, res) => {
    adminService
      .contractNote(req, getSubdomain(req))
      .then(result => {
        res.json({
          status: 0,
          data: result
        });
      })
      .catch(error => {
        console.log(error);
        throw new Error('Contract note error');
      });
  }
);
router.get('/download/csvFile', async (req, res) => {
  console.log('fileName', req.query.fileName);
  let fileName = req.query.fileName;
  const filePath = `./data/downloads/csv/` + fileName;
  res.download(filePath);
});
export default router;
