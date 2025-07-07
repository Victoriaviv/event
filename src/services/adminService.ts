// src/services/adminService.ts

import { AppDataSource } from '../ormconfig';
import { User, UserRole } from '../entities/User';
import { hashPassword } from '../utils/password';
import { sendEmail } from '../utils/email';

const userRepo = AppDataSource.getRepository(User);

export const createAdmin = async (email: string, password: string, name: string) => {
  const existing = await userRepo.findOne({ where: { email } });
  if (existing) throw new Error('Email already exists');

  const hashed = await hashPassword(password);
  const user = userRepo.create({ email, password: hashed, name, role: UserRole.ADMIN, isApproved: false });
  await userRepo.save(user);
  await sendEmail(user.email, 'Admin Registration', 'Congrats, wait for your approval from super-admin.');
  return user;
};

export const getAllAdmins = async () => {
  return await userRepo.find({ where: { role: UserRole.ADMIN } });
};

export const approveAdminById = async (id: number) => {
  const admin = await userRepo.findOne({ where: { id, role: UserRole.ADMIN } });
  if (!admin) throw new Error('Admin not found');
  if (admin.isApproved) return 'already';

  admin.isApproved = true;
  await userRepo.save(admin);

  const subject = '🎉 Admin Account Approved';
  const message = `
    Hello ${admin.name},

    Your admin account has been approved by the Super Admin.

    👉 http://localhost:3000/login

    Regards,
    Event Management Team
  `;

  await sendEmail(admin.email, subject, message);
  return 'approved';
};

export const rejectAdminById = async (id: number) => {
  const admin = await userRepo.findOne({ where: { id, role: UserRole.ADMIN } });
  if (!admin) throw new Error('Admin not found');

  await userRepo.delete(admin.id);
  await sendEmail(admin.email, 'Admin Rejected', 'Your admin account request was rejected.');
  return true;
};

export const getAllUsers = async () => {
  return await userRepo.find();
};
