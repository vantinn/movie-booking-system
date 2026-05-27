import { Router } from 'express';
import * as bookingsController from '../../controllers/user/booking-final.controller'
import { authGuard, authorizaRole } from "../../middleware/auth.middleware";
import { UserRole } from '../../enums/role';
const router = Router();

// router.use(authGuard, authorizaRole(UserRole.USER))

router.get('/:id', bookingsController.getBookingById);//use
router.post('/', bookingsController.createBooking); //use
router.patch("/:id/cancel", bookingsController.cancelSeatRealTime);//use


export default router


