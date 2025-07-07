import { Router } from 'express';
import { bookTicket, getBookings, getBookingById, approveBooking, rejectBooking } from '../controllers/bookingController';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';

const router = Router();

router.post('/', authenticateJWT, requireRole('user'), bookTicket);
router.get('/', authenticateJWT, getBookings);
router.get('/:id', authenticateJWT, getBookingById);
router.post('/:id/approve', authenticateJWT, requireRole('admin', 'super-admin'), approveBooking);
router.post('/:id/reject', authenticateJWT, requireRole('admin', 'super-admin'), rejectBooking);

export default router; 