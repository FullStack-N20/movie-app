import { Router } from 'express';
import { GenreController } from '../controllers/genre.controller.js';
import jwtAuth from '../middleware/jwt-auth.js';
import validate from '../middleware/validate.js';
import { createGenreSchema } from '../utils/validation/genre.js';

const router = Router();
const controller = new GenreController()

router.get('/', controller.list);
router.post('/', jwtAuth, validate(createGenreSchema), controller.create);
router.delete('/:id', jwtAuth, controller.remove);

export default router;
