import { Router } from 'express';
import * as bookingsController from '../../controllers/admin/booking.controller'

const router = Router();

router.get('/', bookingsController.getAllBooking);
router.delete('/:id', bookingsController.deleteBooking);

export default router

