"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.rejectAdmin = exports.approveAdmin = exports.getAdmins = exports.addAdmin = void 0;
const ormconfig_1 = require("../../ormconfig");
const User_1 = require("../entities/User");
const password_1 = require("../utils/password");
const email_1 = require("../utils/email");
const userRepo = ormconfig_1.AppDataSource.getRepository(User_1.User);
const addAdmin = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const existing = await userRepo.findOne({ where: { email } });
        if (existing)
            return res.status(400).json({ message: 'Email already exists' });
        const hashed = await (0, password_1.hashPassword)(password);
        const user = userRepo.create({ email, password: hashed, name, role: 'admin', isApproved: false });
        await userRepo.save(user);
        await (0, email_1.sendEmail)(user.email, 'Admin Registration', 'Congrats, wait for your approval from super-admin.');
        res.status(201).json({ message: 'Admin created, pending approval', user: { id: user.id, email: user.email, isApproved: user.isApproved } });
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to add admin', error: err.message });
    }
};
exports.addAdmin = addAdmin;
const getAdmins = async (req, res) => {
    try {
        const admins = await userRepo.find({ where: { role: 'admin' } });
        res.json(admins);
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to get admins', error: err.message });
    }
};
exports.getAdmins = getAdmins;
const approveAdmin = async (req, res) => {
    try {
        const admin = await userRepo.findOne({ where: { id: Number(req.params.id), role: 'admin' } });
        if (!admin)
            return res.status(404).json({ message: 'Admin not found' });
        admin.isApproved = true;
        await userRepo.save(admin);
        await (0, email_1.sendEmail)(admin.email, 'Admin Approved', 'Your admin account has been approved.');
        res.json({ message: 'Admin approved', admin });
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to approve admin', error: err.message });
    }
};
exports.approveAdmin = approveAdmin;
const rejectAdmin = async (req, res) => {
    try {
        const admin = await userRepo.findOne({ where: { id: Number(req.params.id), role: 'admin' } });
        if (!admin)
            return res.status(404).json({ message: 'Admin not found' });
        await userRepo.delete(admin.id);
        await (0, email_1.sendEmail)(admin.email, 'Admin Rejected', 'Your admin account request was rejected.');
        res.json({ message: 'Admin rejected and deleted' });
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to reject admin', error: err.message });
    }
};
exports.rejectAdmin = rejectAdmin;
const getUsers = async (req, res) => {
    try {
        const users = await userRepo.find();
        res.json(users);
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to get users', error: err.message });
    }
};
exports.getUsers = getUsers;
