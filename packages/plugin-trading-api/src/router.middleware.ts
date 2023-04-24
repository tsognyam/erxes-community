import { Router } from 'express';
import SubscriptionRouter from './controller/subscription.controller';
import AdminRouter from './controller/admin.controller';
import MigrationRouter from './controller/migration.controller';
const router = Router();
router.use('/mse', SubscriptionRouter);
router.use('/admin', AdminRouter);
router.use('/migration', MigrationRouter);
router.use((req, res, next) => {
  console.log(req);
  const err = new Error('API URL not found!');

  next(err);
});
export default router;
