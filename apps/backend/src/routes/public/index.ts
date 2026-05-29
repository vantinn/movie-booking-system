import { Router } from 'express';
import movies from "./movies.route";
import cinema from "./cinema.route";
import auth from "./auth.route";
import seat from "./seat.route";
import showtime from "./showtime.route";
import room from "./room.route";



const routerPublic = Router();


routerPublic.use('/movies', movies);
routerPublic.use('/cinemas', cinema);
routerPublic.use('/auth', auth);
routerPublic.use('/seats', seat);
routerPublic.use('/showtimes', showtime);
routerPublic.use('/rooms', room);


export default routerPublic;


