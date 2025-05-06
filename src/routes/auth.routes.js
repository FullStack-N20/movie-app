import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';

const router = Router();
const controller = new AuthController()

router.post('/register',  controller.register);
router.post('/verify-register-otp',  controller.verifyRegisterOTP);
router.post('/login', controller.login);
router.post('/verify-login-otp', controller.verifyLoginOTP);

export default router;

