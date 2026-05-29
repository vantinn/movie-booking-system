import { Router } from 'express';
import * as cinemaController from '../../controllers/admin/cinema.controller'
const router = Router();

router.post('/', cinemaController.creatCinema);
router.put('/:id', cinemaController.updateCinema);
router.delete('/:id', cinemaController.deleteMovies);

export default router

