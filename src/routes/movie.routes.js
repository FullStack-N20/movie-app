import { Router } from 'express';
import { MovieController } from '../controllers/movie.controller.js';
import { JwtAuthGuard } from '../middleware/jwt-auth.guard.js';
import validate from '../middleware/validate.js';
import { movieValidation } from '../utils/movie-validation.js';

const router = Router();
const controller = new MovieController();

router.get('/', validate(movieValidation.list), controller.list);

router.get('/:id', validate(movieValidation.detail), controller.detail);

router.post(
  '/',
  JwtAuthGuard,
  validate(movieValidation.create),
  controller.create
);

router.patch(
  '/:id',
  JwtAuthGuard,
  validate(movieValidation.update),
  controller.update
);

router.delete(
  '/:id',
  JwtAuthGuard,
  validate(movieValidation.remove),
  controller.remove
);

export default router;
