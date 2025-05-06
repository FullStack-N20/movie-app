import { Router } from 'express';
import { GenreController } from '../controllers/genre.controller.js';
import { JwtAuthGuard } from '../middleware/jwt-auth.guard.js';

const router = Router();
const controller = new GenreController();

router.get('/', controller.list);

router.post('/',JwtAuthGuard,controller.create);

router.delete('/:id',JwtAuthGuard,controller.remove);

export default router;
