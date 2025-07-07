import { Router } from 'express';
import { addEvent, getEvents, getEventByIdController } from '../controllers/eventController';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';

const router = Router();

router.post('/', authenticateJWT, requireRole('admin', 'super-admin'), addEvent);
router.get('/', getEvents);
router.get('/:id', getEventByIdController);

export default router; 