// src/controllers/adminController.ts

import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import {
  createAdmin,
  getAllAdmins,
  approveAdminById,
  rejectAdminById,
  getAllUsers,
} from '../services/adminService';

export const addAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, name } = req.body;
    const user = await createAdmin(email, password, name);
    res.status(201).json({
      message: 'Admin created, pending approval',
      user: { id: user.id, email: user.email, isApproved: user.isApproved },
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getAdmins = async (_req: AuthRequest, res: Response) => {
  try {
    const admins = await getAllAdmins();
    res.json(admins);
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to get admins', error: err.message });
  }
};

export const approveAdmin = async (req: Request, res: Response) => {
  try {
    const result = await approveAdminById(Number(req.params.id));
    if (result === 'already') {
      res.send('<h2>✅ Admin is already approved.</h2>');
    } else {
      res.send('<h2>✅ Admin approved successfully. Email notification sent.</h2>');
    }
  } catch (err: any) {
    res.status(500).send(`<h2>❌ Failed to approve admin: ${err.message}</h2>`);
  }
};

export const rejectAdmin = async (req: Request, res: Response) => {
  try {
    await rejectAdminById(Number(req.params.id));
    res.send('<h2>❌ Admin rejected and deleted.</h2>');
  } catch (err: any) {
    res.status(500).send(`<h2>❌ Failed to reject admin: ${err.message}</h2>`);
  }
};

export const getUsers = async (_req: AuthRequest, res: Response) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to get users', error: err.message });
  }
};
