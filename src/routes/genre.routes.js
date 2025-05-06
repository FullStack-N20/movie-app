import { Router } from 'express';
import { GenreController } from '../controllers/genre.controller.js';
import { JwtAuthGuard } from '../middleware/jwt-auth.guard.js';
import validate from '../middleware/validate.js';
import { genreValidation } from '../utils/genre-validation.js';

const router = Router();
const controller = new GenreController();

router.get('/', controller.list);

router.post(
  '/',
  JwtAuthGuard,
  validate(genreValidation.create),
  controller.create
);

router.delete(
  '/:id',
  JwtAuthGuard,
  validate(genreValidation.remove),
  controller.remove
);

export default router;
