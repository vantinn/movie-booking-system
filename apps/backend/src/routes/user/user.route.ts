import { Router } from 'express';
import * as userController from '../../controllers/user/user.controller';
import { authGuard } from '../../middleware/auth.middleware';
import { validateBody } from '../../middleware/validator.middleware';
import { UpdateUserDTO, ChangePasswordDTO } from '../../dtos/user.dto';

const router = Router();

// All routes require authentication
router.use(authGuard);

// GET /api/user/users/profile  — get own profile
router.get('/profile', userController.getProfile);

// PUT /api/user/users/profile  — update own profile
router.put('/profile', validateBody(UpdateUserDTO), userController.updateUser);

// POST /api/user/users/change-password — change own password
router.post('/change-password', validateBody(ChangePasswordDTO), userController.changePassword);

export default router;
