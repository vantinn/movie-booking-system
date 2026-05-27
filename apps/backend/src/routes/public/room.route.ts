import { Router } from 'express';
import * as roomController from '../../controllers/public/room.controller';

const router = Router();

/**
 * GET /api/public/rooms          → all rooms
 * GET /api/public/rooms?ids=a,b  → rooms by ids
 *
 * Previously both handlers were on GET '/' — getRoomsByIds was NEVER called.
 * Merged into one handler that checks ?ids.
 */
router.get('/', roomController.getRoomsHandler);

export default router;
