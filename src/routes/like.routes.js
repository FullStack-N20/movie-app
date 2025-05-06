import { Router } from 'express';
import { LikeController } from '../controllers/like.controller.js';
import jwtAuth from '../middleware/jwt-auth.js';
import validate from '../middleware/validate.js';
import { likeSchema } from '../utils/validation/like.js';

const router = Router();
const controller = new LikeController()

router.post('/', jwtAuth, validate(likeSchema), controller.like);
router.delete('/', jwtAuth, validate(likeSchema), controller.unlike);

export default router;
