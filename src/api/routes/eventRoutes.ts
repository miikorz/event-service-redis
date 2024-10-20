import { Router } from 'express';
import { getEvents } from '../controllers/eventController';

const router = Router();

/**
 * @route GET /events
 * @desc Get events within a time range
 * @query { starts_at: string, ends_at: string }
 */
router.get('/events', getEvents);

export default router;
