import { Router } from 'express';
import * as cinemaController from '../../controllers/public/cinema.controller';

const router = Router();

/**
 * GET /api/public/cinemas          → all cinemas
 * GET /api/public/cinemas?ids=a,b  → cinemas by ids
 * GET /api/public/cinemas/:id      → single cinema
 *
 * Previously both handlers were registered on GET '/' which meant
 * getCinemasByIdsHandler was NEVER reached.  Fixed by merging into
 * one handler that checks for the ?ids query param.
 */
router.get('/', cinemaController.getCinemasHandler);
router.get('/:id', cinemaController.getCinemaByIdHandler);

export default router;
