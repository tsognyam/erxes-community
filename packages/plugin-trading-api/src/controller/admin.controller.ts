import { Router } from 'express';
import AdminService from '../service/admin.service';
import multer = require('multer');
import { getSubdomain } from '@erxes/api-utils/src/core';
import * as fs from 'fs';
import ExportService from '../service/export.service';
const upload = multer({ dest: './data/uploads' });
const router = Router();
const adminService = new AdminService();
const exporter = new ExportService();
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
router.get('/export', async (req, res) => {
  const { query } = req;
  const { type } = query;
  res.setHeader(
    'Content-disposition',
    'attachment; filename=stockTransaction.csv'
  );
  res.setHeader('Content-type', 'text/csv');
  try {
    let columns: any = {};
    if (type == 'stockTransaction') {
      columns = {
        prefix: 'Prefix',
        dater: 'Date',
        stockcode: 'CODE',
        symbol: 'SYMBOL',
        name: 'NAME',
        type: 'Type',
        income: 'Income',
        outcome: 'Outcome',
        expectedIncome: 'ExpectedIncome',
        expectedOutcome: 'ExpectedOutcome',
        description: 'Description',
        price: 'Price',
        fee: 'Fee',
        createdAt: 'Created Date'
      };
      const csvTransform: any = await exporter.exportStockTransaction(
        query,
        columns,
        res
      );
      csvTransform.on('error', err => {
        console.error(err);
        res.status(500).end();
      });
    } else if (type == 'transactions') {
      columns = {
        prefix: 'Prefix',
        dater: 'Date',
        type: 'Type',
        income: 'Income',
        outcome: 'Outcome',
        expectedIncome: 'ExpectedIncome',
        expectedOutcome: 'ExpectedOutcome',
        description: 'Description'
      };
      const csvTransform: any = await exporter.exportTransaction(
        query,
        columns,
        res
      );
      csvTransform.on('error', err => {
        console.error(err);
        res.status(500).end();
      });
    } else res.status(404).end();
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});
export default router;
