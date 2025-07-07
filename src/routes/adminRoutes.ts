
import express from 'express';
import { addAdmin, getAdmins, approveAdmin, rejectAdmin, getUsers } from '../controllers/adminController';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';

const router = express.Router();



  

router.post('/', authenticateJWT, requireRole('super-admin'), addAdmin);
router.get('/', authenticateJWT, requireRole('super-admin'), getAdmins);
router.post('/:id/approve', authenticateJWT, requireRole('super-admin'), approveAdmin);
router.post('/:id/reject', authenticateJWT, requireRole('super-admin'), rejectAdmin);
router.get('/:id/approve', approveAdmin);  
router.get('/:id/reject', rejectAdmin);    
router.get('/users', authenticateJWT, requireRole('admin', 'super-admin'), getUsers);

export default router; 