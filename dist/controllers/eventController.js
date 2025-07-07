"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEventById = exports.getEvents = exports.addEvent = void 0;
const ormconfig_1 = require("../../ormconfig");
const Event_1 = require("../entities/Event");
const User_1 = require("../entities/User");
const eventRepo = ormconfig_1.AppDataSource.getRepository(Event_1.Event);
const userRepo = ormconfig_1.AppDataSource.getRepository(User_1.User);
const addEvent = async (req, res) => {
    try {
        const { title, description, date, location, totalSeats } = req.body;
        const user = await userRepo.findOne({ where: { id: req.user.id } });
        if (!user || (user.role !== 'admin' && user.role !== 'super-admin')) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const event = eventRepo.create({
            title,
            description,
            date,
            location,
            totalSeats,
            availableSeats: totalSeats,
            createdBy: user,
        });
        await eventRepo.save(event);
        res.status(201).json(event);
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to add event', error: err.message });
    }
};
exports.addEvent = addEvent;
const getEvents = async (req, res) => {
    try {
        const events = await eventRepo.find({ relations: ['createdBy'] });
        res.json(events);
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to get events', error: err.message });
    }
};
exports.getEvents = getEvents;
const getEventById = async (req, res) => {
    try {
        const event = await eventRepo.findOne({ where: { id: Number(req.params.id) }, relations: ['createdBy'] });
        if (!event)
            return res.status(404).json({ message: 'Event not found' });
        res.json(event);
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to get event', error: err.message });
    }
};
exports.getEventById = getEventById;
