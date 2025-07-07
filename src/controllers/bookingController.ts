// 📁 controllers/bookingController.ts
// =====================
import { Request, Response } from 'express';
import {
  bookEventTicket,
  getAllBookings,
  getBookingDetails,
  approveBookingRequest,
  rejectBookingRequest,
} from '../services/bookingService';

export const bookTicket = async (req: Request, res: Response) => {
  try {
    const { eventId, quantity } = req.body;
    const userId = (req as any).user.id;
    const booking = await bookEventTicket(eventId, userId, quantity);
    res.status(201).json({ message: 'Booking requested', booking });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getBookings = async (req: Request, res: Response) => {
  try {
    const { role, id } = (req as any).user;
    const bookings = await getAllBookings(role, id);
    res.status(200).json(bookings);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getBookingById = async (req: Request, res: Response) => {
  try {
    const booking = await getBookingDetails(parseInt(req.params.id));
    res.status(200).json(booking);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const approveBooking = async (req: Request, res: Response) => {
  try {
    const booking = await approveBookingRequest(parseInt(req.params.id));
    res.status(200).json({ message: 'Booking approved', booking });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const rejectBooking = async (req: Request, res: Response) => {
  try {
    const booking = await rejectBookingRequest(parseInt(req.params.id));
    res.status(200).json({ message: 'Booking rejected', booking });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};