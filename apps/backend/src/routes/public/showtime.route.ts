import { Router } from 'express';
import * as showTimeController from '../../controllers/public/showtime.controller';
import { authGuard, authorizaRole } from '../../middleware/auth.middleware';
import { UserRole } from '../../enums/role';

const router = Router();

/**
 * GET /api/public/showtimes               → all showtimes
 * GET /api/public/showtimes?movieId=xxx   → showtimes filtered by movie
 * GET /api/public/showtimes?movieId=xxx&date=2024-01-15  → filtered by movie + date
 *
 * Previously getShowTimesByMovie was NEVER registered — the route only had
 * getAllShowTime on GET '/'.  Fixed by merging into one handler.
 */
router.get('/', showTimeController.getShowTimesHandler);

// Seat lookup requires authentication
router.use(authGuard, authorizaRole(UserRole.USER));
router.get('/:showTimeId/seats', showTimeController.getSeatByShowTime);

export default router;
