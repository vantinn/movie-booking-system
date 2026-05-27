import { Router } from 'express';
import * as bookingsController from '../../controllers/user/booking.controller'

const router = Router();


// router.post('/', bookingsController.createBooking);
router.put('/:id', bookingsController.updateBooking);
router.delete('/:id', bookingsController.deleteBooking);

export default router


