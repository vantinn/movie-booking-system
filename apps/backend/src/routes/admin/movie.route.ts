import { Router } from 'express';
import * as moviesController from '../../controllers/admin/movie.controller'

const router = Router();

router.post('/', moviesController.createMovies);
router.put('/:id', moviesController.updateMovies);
router.delete('/:id', moviesController.deleteMovies);

export default router

