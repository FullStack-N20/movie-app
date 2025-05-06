import { Router } from 'express';
import { MovieController } from '../controllers/movie.controller.js';
import { JwtAuthGuard } from '../middleware/jwt-auth.guard.js';


const router = Router();
const controller = new MovieController();

router.get('/',  controller.list);

router.get('/:id', controller.detail);

router.post('/',JwtAuthGuard,controller.create);

router.patch('/:id',JwtAuthGuard,controller.update);

router.delete('/:id',JwtAuthGuard,controller.remove);

export default router;
