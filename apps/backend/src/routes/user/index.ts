import { Router } from 'express';
import userRoutes from './user.route';
import booking from "./booking.route";
import bookingSeat from "./booking-seat.route";
import bookingSeatTest from "./booking-final.route";
// import paymentSession from "./payment.route";
import paymentIntSession from "./payment-int.route";


import { authGuard, authorizaRole } from "../../middleware/auth.middleware";
import { UserRole } from '../../enums/role';


const routerUser = Router();


// routerUser.use(authGuard, authorizaRole(UserRole.USER))

routerUser.use('/users', userRoutes);
routerUser.use('/bookings', booking);
routerUser.use('/bookingSeat', bookingSeat);
routerUser.use('/bookingSeatTest', bookingSeatTest);
// routerUser.use('/payment', paymentSession);
routerUser.use('/paymentInt', paymentIntSession);



export default routerUser;


