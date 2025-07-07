"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.resetPassword = exports.forgotPassword = exports.login = exports.register = void 0;
const ormconfig_1 = require("../../ormconfig");
const User_1 = require("../entities/User");
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
const PasswordResetToken_1 = require("../entities/PasswordResetToken");
const email_1 = require("../utils/email");
const crypto_1 = __importDefault(require("crypto"));
const userRepo = ormconfig_1.AppDataSource.getRepository(User_1.User);
const tokenRepo = ormconfig_1.AppDataSource.getRepository(PasswordResetToken_1.PasswordResetToken);
const register = async (req, res) => {
    try {
        const { email, password, name, role } = req.body;
        const existing = await userRepo.findOne({ where: { email } });
        if (existing)
            return res.status(400).json({ message: 'Email already exists' });
        const hashed = await (0, password_1.hashPassword)(password);
        const isApproved = role === 'admin' ? false : true;
        const user = userRepo.create({ email, password: hashed, name, role, isApproved });
        await userRepo.save(user);
        // TODO: Send email if admin
        res.status(201).json({ message: 'User registered', user: { id: user.id, email: user.email, role: user.role, isApproved: user.isApproved } });
    }
    catch (err) {
        res.status(500).json({ message: 'Registration failed', error: err.message });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userRepo.findOne({ where: { email } });
        if (!user)
            return res.status(400).json({ message: 'Invalid credentials' });
        if (!user.isApproved)
            return res.status(403).json({ message: 'Account not approved yet' });
        const valid = await (0, password_1.comparePassword)(password, user.password);
        if (!valid)
            return res.status(400).json({ message: 'Invalid credentials' });
        const token = (0, jwt_1.generateToken)({ id: user.id, role: user.role });
        res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
    }
    catch (err) {
        res.status(500).json({ message: 'Login failed', error: err.message });
    }
};
exports.login = login;
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userRepo.findOne({ where: { email } });
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        const token = crypto_1.default.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
        const resetToken = tokenRepo.create({ user, token, expiresAt });
        await tokenRepo.save(resetToken);
        const resetLink = `${req.protocol}://${req.get('host')}/reset-password?token=${token}`;
        await (0, email_1.sendEmail)(user.email, 'Password Reset', `Reset your password: ${resetLink}`);
        res.json({ message: 'Password reset email sent' });
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to send reset email', error: err.message });
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const resetToken = await tokenRepo.findOne({ where: { token }, relations: ['user'] });
        if (!resetToken || resetToken.expiresAt < new Date()) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }
        const user = resetToken.user;
        user.password = await (0, password_1.hashPassword)(newPassword);
        await userRepo.save(user);
        await tokenRepo.delete({ id: resetToken.id });
        res.json({ message: 'Password reset successful' });
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to reset password', error: err.message });
    }
};
exports.resetPassword = resetPassword;
const getProfile = async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ message: 'Unauthorized' });
        const user = await userRepo.findOne({ where: { id: req.user.id } });
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        res.json({ id: user.id, email: user.email, name: user.name, role: user.role, isApproved: user.isApproved });
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to get profile', error: err.message });
    }
};
exports.getProfile = getProfile;
