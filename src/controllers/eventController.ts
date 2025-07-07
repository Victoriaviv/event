// 📁 controllers/eventController.ts
// =====================
import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import {
  createEvent,
  getAllEvents,
  getEventById,
} from '../services/eventService';

export const addEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, date, location, totalSeats } = req.body;
    const event = await createEvent(title, description, date, location, totalSeats, req.user!.id);
    res.status(201).json(event);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getEvents = async (_req: Request, res: Response) => {
  try {
    const events = await getAllEvents();
    res.json(events);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getEventByIdController = async (req: Request, res: Response) => {
  try {
    const event = await getEventById(Number(req.params.id));
    res.json(event);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
