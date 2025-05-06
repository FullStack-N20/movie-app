import { Router } from 'express';
import { ReviewController } from '../controllers/review.controller.js';
import { JwtAuthGuard } from '../middleware/jwt-auth.guard.js';
import validate from '../middleware/validate.js';
import { reviewValidation } from '../utils/review-validation.js';

const router = Router();
const controller = new ReviewController();

router.get('/', validate(reviewValidation.list), controller.list);

router.post(
  '/',
  JwtAuthGuard,
  validate(reviewValidation.create),
  controller.create
);

router.patch(
  '/:id',
  JwtAuthGuard,
  validate(reviewValidation.update),
  controller.update
);

router.delete(
  '/:id',
  JwtAuthGuard,
  validate(reviewValidation.remove),
  controller.remove
);

export default router;
