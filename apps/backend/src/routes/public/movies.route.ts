
import { Router } from 'express';
import * as moviesController from '../../controllers/public/movie.controller'
import { authGuard, authorizaRole } from "../../middleware/auth.middleware";
import { UserRole } from '../../enums/role';

const router = Router();
// router.use(authGuard, authorizaRole(UserRole.USER))

router.get('/', moviesController.getAllMovies);
router.get('/:id', moviesController.getMovieByIdHandler);

export default router

