import { Router } from 'express';
import * as bookingSeatController from '../../controllers/user/booking-seat.controller'

const router = Router();


router.post('/', bookingSeatController.createBookingSeat);

export default router

