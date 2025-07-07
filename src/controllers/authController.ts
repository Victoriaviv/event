// 📁 controllers/authController.ts
// =====================
import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import {
  registerUser,
  loginUser,
  forgotUserPassword,
  resetUserPassword,
  getUserProfile,
} from '../services/authService';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, role } = req.body;
    const user = await registerUser(email, password, name, role, req);
    res.status(201).json({
      message: 'User registered',
      user: { id: user.id, email: user.email, role: user.role, isApproved: user.isApproved },
    });
  } catch (err: any) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await loginUser(email, password);
    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    await forgotUserPassword(req.body.email, req);
    res.json({ message: 'Password reset email sent' });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to send reset email', error: err.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    await resetUserPassword(req.body.token, req.body.newPassword);
    res.json({ message: 'Password reset successful' });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to reset password', error: err.message });
  }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;  // Just return void here, don't return the response object
    }

    const user = await getUserProfile(req.user.id);
    res.json({ id: user.id, email: user.email, name: user.name, role: user.role, isApproved: user.isApproved });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to get profile', error: err.message });
  }
};
