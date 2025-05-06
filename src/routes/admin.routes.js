import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { JwtAuthGuard } from '../middleware/jwt-auth.guard.js';
import { SuperAdminGuard } from '../middleware/superAdmin.guard.js';
import { SelfGuard } from '../middleware/self.guard.js';
import validate from '../middleware/validate.js';
import { adminValidation } from '../utils/admin-validation.js';

const router = Router();
const controller = new AdminController();

router.post(
  '/',
  JwtAuthGuard,
  SuperAdminGuard,
  validate(adminValidation.create),
  controller.createAdmin
);

router.post(
  '/superAdmin',
  validate(adminValidation.create),
  controller.createSuperAdmin
);

router.get(
  '/',
  JwtAuthGuard,
  SuperAdminGuard,
  controller.getAllAdmins
);

router.get(
  '/:id',
  JwtAuthGuard,
  SelfGuard,
  controller.getAdminByID
);

router.patch(
  '/:id',
  JwtAuthGuard,
  SelfGuard,
  validate(adminValidation.update),
  controller.updateAdmin
);

router.delete(
  '/:id',
  JwtAuthGuard,
  SuperAdminGuard,
  controller.deleteAdmin
);

router.post(
  '/signIn',
  validate(adminValidation.signIn),
  controller.signIn
);

export default router;
