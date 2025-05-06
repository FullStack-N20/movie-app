import { Router } from 'express';
import { ReviewController } from '../controllers/review.controller.js';
import jwtAuth from '../middleware/jwt-auth.js';
import validate from '../middleware/validate.js';
import {
  createReviewSchema,
  updateReviewSchema,
} from '../utils/validation/review.js';

const router = Router();
const controller = new ReviewController()

router.get('/', controller.list);
router.post(
  '/',
  jwtAuth,
  validate(createReviewSchema),
  controller.create
);
router.put(
  '/:id',
  jwtAuth,
  validate(updateReviewSchema),
  controller.update
);
router.delete('/:id', jwtAuth, controller.remove);

export default router;
