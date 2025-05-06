import { Router } from 'express';
import { ReviewController } from '../controllers/review.controller.js';
import { JwtAuthGuard } from '../middleware/jwt-auth.guard.js';


const router = Router();
const controller = new ReviewController();

router.get('/',  controller.list);

router.post('/',JwtAuthGuard,controller.create);

router.patch('/:id',JwtAuthGuard,controller.update);

router.delete('/:id',JwtAuthGuard,controller.remove);

export default router;
