import { Router } from 'express';
import * as bookingSeatController from '../../controllers/admin/booking-seat.controller'

const router = Router();

router.get('/', bookingSeatController.getAllBookingSeat);

export default router

