import { Router } from 'express';
import * as roomController from '../../controllers/admin/room.controller'

const router = Router();

router.post('/', roomController.createRoom);
router.put('/:id', roomController.updateRoom);
router.delete('/:id', roomController.deleteRoom);

export default router

