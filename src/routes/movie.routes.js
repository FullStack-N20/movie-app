import { Router } from 'express';
import { MovieController } from '../controllers/movie.controller.js';
import jwtAuth from '../middleware/jwt-auth.js';
import validate from '../middleware/validate.js';
import {
  createMovieSchema,
  updateMovieSchema,
} from '../utils/validation/movie.js';

const router = Router();
const controller = new MovieController()

router.get('/', controller.list);
router.get('/:id', controller.detail);
router.post('/', jwtAuth, validate(createMovieSchema), controller.create);
router.put(
  '/:id',
  jwtAuth,
  validate(updateMovieSchema),
  controller.update
);
router.delete('/:id', jwtAuth, controller.remove);

export default router;
