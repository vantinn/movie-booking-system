import { Router } from 'express';
import * as seatController from '../../controllers/public/seat.controller'

const router = Router();

router.get('/', seatController.getAllSeat);

export default router

