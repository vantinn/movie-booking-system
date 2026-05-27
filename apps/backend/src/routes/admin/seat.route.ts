import { Router } from 'express';
import * as seatController from '../../controllers/admin/seat.controller'

const router = Router();

router.post('/', seatController.createSeats);
router.put('/:id', seatController.updateSeat);
router.delete('/:id', seatController.deleteSeat);

export default router

