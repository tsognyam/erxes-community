import { Router } from 'express';
import SubscriptionRouter from './controller/subscription.controller';
import AdminRouter from './controller/admin.controller';
const router = Router();

router.use('/mse', SubscriptionRouter);
router.use('/admin', AdminRouter);
router.use((req, res, next) => {
  const err = new Error('API URL not found!');

  next(err);
});
export default router;
