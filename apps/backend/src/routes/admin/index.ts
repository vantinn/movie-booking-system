import { Router } from 'express';
import userRoutes from './user.route';
import movies from "./movie.route";
import booking from "./booking.route";
import cinema from "./cinema.route";
import bookingSeat from "./booking-seat.route";
import seat from "./seat.route";
import showtime from "./showtime.route";
import room from "./room.route";
import { authGuard, authorizaRole } from "../../middleware/auth.middleware";
import { UserRole } from '../../enums/role';


const routerAdmin = Router();

// routerAdmin.use(authGuard, authorizaRole(UserRole.ADMIN))

routerAdmin.use('/users', userRoutes);
routerAdmin.use('/movies', movies);
routerAdmin.use('/bookings', booking);
routerAdmin.use('/cinemas', cinema);
routerAdmin.use('/bookingSeat', bookingSeat);
routerAdmin.use('/seats', seat);
routerAdmin.use('/showtimes', showtime);
routerAdmin.use('/rooms', room);

export default routerAdmin

