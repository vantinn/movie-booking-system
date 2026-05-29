import { Router } from 'express';
import * as showTimeController from '../../controllers/admin/showtime.controller'

const router = Router();

router.post('/', showTimeController.creatShowTime);
router.put('/:id', showTimeController.updateShowTime);
router.delete('/:id', showTimeController.deleteShowTime);

export default router

