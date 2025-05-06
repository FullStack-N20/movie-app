import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { JwtAuthGuard } from '../middleware/jwt-auth.guard.js';
import { SuperAdminGuard } from '../middleware/superAdmin.guard.js';
import { SelfGuard } from '../middleware/self.guard.js';


const router = Router();
const controller = new AdminController();

router.post('/',JwtAuthGuard,SuperAdminGuard,controller.createAdmin);

router.post('/superAdmin', controller.createSuperAdmin);

router.get('/', JwtAuthGuard, SuperAdminGuard, controller.getAllAdmins);

router.get('/:id', JwtAuthGuard, SelfGuard, controller.getAdminByID);

router.patch('/:id',JwtAuthGuard,SelfGuard,controller.updateAdmin);

router.delete('/:id', JwtAuthGuard, SuperAdminGuard, controller.deleteAdmin);

router.post('/signIn',  controller.signIn);

export default router;
