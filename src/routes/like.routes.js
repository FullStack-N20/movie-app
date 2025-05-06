import { Router } from 'express';
import { LikeController } from '../controllers/like.controller.js';
import { JwtAuthGuard } from '../middleware/jwt-auth.guard.js';


const router = Router();
const controller = new LikeController();

router.post('/', JwtAuthGuard,  controller.like);

router.delete('/',JwtAuthGuard,controller.unlike);

export default router;
