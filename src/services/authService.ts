// 📁 services/authService.ts
// =====================
import { AppDataSource } from '../ormconfig';
import { User, UserRole } from '../entities/User';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { PasswordResetToken } from '../entities/PasswordResetToken';
import { sendEmail } from '../utils/email';
import crypto from 'crypto';

const userRepo = AppDataSource.getRepository(User);
const tokenRepo = AppDataSource.getRepository(PasswordResetToken);

export const registerUser = async (email: string, password: string, name: string, role: string, req: any) => {
  const existing = await userRepo.findOne({ where: { email } });
  if (existing) throw new Error('Email already exists');

  const hashed = await hashPassword(password);
  const isApproved = role === 'admin' ? false : true;
  const user = userRepo.create({
    email,
    password: hashed,
    name,
    role: role === 'admin' ? UserRole.ADMIN : UserRole.USER,
    isApproved,
  });
  await userRepo.save(user);

  if (role === 'admin') {
    const superAdmins = await userRepo.find({ where: { role: UserRole.SUPER_ADMIN } });
    const approvalLink = `${req.protocol}://${req.get('host')}/api/admins/${user.id}/approve`;
    const rejectionLink = `${req.protocol}://${req.get('host')}/api/admins/${user.id}/reject`;

    const message = `New admin requested access:\n\nName: ${name}\nEmail: ${email}\n\nApprove: ${approvalLink}\nReject: ${rejectionLink}`;
    for (const sa of superAdmins) {
      await sendEmail(sa.email, 'New Admin Registration Request', message);
    }
  }
  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user = await userRepo.findOne({ where: { email } });
  if (!user) throw new Error('Invalid credentials');
  if (!user.isApproved) throw new Error('Account not approved yet');
  const valid = await comparePassword(password, user.password);
  if (!valid) throw new Error('Invalid credentials');
  const token = generateToken({ id: user.id, role: user.role });
  return { token, user };
};

export const forgotUserPassword = async (email: string, req: any) => {
  const user = await userRepo.findOne({ where: { email } });
  if (!user) throw new Error('User not found');
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60);
  const resetToken = tokenRepo.create({ user, token, expiresAt });
  await tokenRepo.save(resetToken);
  const resetLink = `${req.protocol}://${req.get('host')}/reset-password?token=${token}`;
  await sendEmail(user.email, 'Password Reset', `Reset your password: ${resetLink}`);
};

export const resetUserPassword = async (token: string, newPassword: string) => {
  const resetToken = await tokenRepo.findOne({ where: { token }, relations: ['user'] });
  if (!resetToken || resetToken.expiresAt < new Date()) throw new Error('Invalid or expired token');
  const user = resetToken.user;
  user.password = await hashPassword(newPassword);
  await userRepo.save(user);
  await tokenRepo.delete({ id: resetToken.id });
};

export const getUserProfile = async (id: number) => {
  const user = await userRepo.findOne({ where: { id } });
  if (!user) throw new Error('User not found');
  return user;
};