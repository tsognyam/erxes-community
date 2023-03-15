import { Router } from 'express';
import AdminService from '../service/admin.service';
import multer = require('multer');
const upload = multer({ dest: './data/uploads' });
const router = Router();
const adminService = new AdminService();
router.post(
  '/upload/contract-note',
  upload.single('contract-note'),
  async (req, res) => {
    adminService
      .contractNote(req)
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

export default router;