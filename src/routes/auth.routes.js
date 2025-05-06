import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import validate from '../middleware/validate.js';
import { authValidation } from '../utils/auth-validation.js';

const router = Router();
const controller = new AuthController();

router.post(
  '/register',
  validate(authValidation.register),
  controller.register
);

router.post(
  '/verify-register-otp',
  validate(authValidation.verifyOTP),
  controller.verifyRegisterOTP
);

router.post('/login', validate(authValidation.login), controller.login);

router.post(
  '/verify-login-otp',
  validate(authValidation.verifyOTP),
  controller.verifyLoginOTP
);

export default router;
