import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { JwtAuthGuard } from '../middleware/jwt-auth.guard.js';
import { SuperAdminGuard } from '../middleware/superAdmin.guard.js';
import { SelfGuard } from '../middleware/self.guard.js';

const router = Router();

const controller = new AdminController();

router
  .post('/', JwtAuthGuard, SuperAdminGuard, controller.createAdmin)
  .post('/superAdmin', controller.createSuperAdmin)
  .get('/', JwtAuthGuard, SuperAdminGuard, controller.getAllAdmins)
  .get('/:id', JwtAuthGuard, SelfGuard, controller.getAdminByID)
  .patch('/:id', JwtAuthGuard, SelfGuard, controller.updateAdmin)
  .delete('/:id', JwtAuthGuard, SuperAdminGuard, controller.deleteAdmin)
  .post('/singIn', controller.singIn);

export default router;
