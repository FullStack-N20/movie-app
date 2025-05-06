import { Router } from 'express';
import { LikeController } from '../controllers/like.controller.js';
import { JwtAuthGuard } from '../middleware/jwt-auth.guard.js';
import validate from '../middleware/validate.js';
import { likeValidation } from '../utils/like-validation.js';

const router = Router();
const controller = new LikeController();

router.post('/', JwtAuthGuard, validate(likeValidation.like), controller.like);

router.delete(
  '/',
  JwtAuthGuard,
  validate(likeValidation.unlike),
  controller.unlike
);

export default router;
