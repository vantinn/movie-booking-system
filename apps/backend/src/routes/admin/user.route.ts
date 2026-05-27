import { Router } from 'express';
import * as userController from '../../controllers/admin/user.controller';
const router = Router();

router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.delete('/:id', userController.deleteUser);

export default router;


