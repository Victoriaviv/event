import { Booking } from '../entities/Booking';
import { Event } from '../entities/Event';
import { User } from '../entities/User';
import { AppDataSource } from '../ormconfig';
import { BookingStatus } from '../entities/Booking';

const bookingRepo = AppDataSource.getRepository(Booking);
const eventRepo = AppDataSource.getRepository(Event);
const userRepo = AppDataSource.getRepository(User);

export const bookEventTicket = async (eventId: number, userId: number, quantity: number) => {
  const event = await eventRepo.findOneBy({ id: eventId });
  const user = await userRepo.findOneBy({ id: userId });
  if (!event || !user) throw new Error('Event or User not found');
  const booking = bookingRepo.create({ event, user, quantity, status: BookingStatus.PENDING });
  return await bookingRepo.save(booking);
};

export const getAllBookings = async (role: string, userId: number) => {
  if (role === 'User') {
    return await bookingRepo.find({ where: { user: { id: userId } }, relations: ['event'], order: { createdAt: 'DESC' } });
  }
  return await bookingRepo.find({ relations: ['event', 'user'], order: { createdAt: 'DESC' } });
};

export const getBookingDetails = async (id: number) => {
  const booking = await bookingRepo.findOne({ where: { id }, relations: ['user', 'event'] });
  if (!booking) throw new Error('Booking not found');
  return booking;
};

export const approveBookingRequest = async (id: number) => {
  const booking = await bookingRepo.findOneBy({ id });
  if (!booking) throw new Error('Booking not found');
  booking.status = BookingStatus.APPROVED;
  return await bookingRepo.save(booking);
};

export const rejectBookingRequest = async (id: number) => {
  const booking = await bookingRepo.findOneBy({ id });
  if (!booking) throw new Error('Booking not found');
  booking.status = BookingStatus.REJECTED;
  return await bookingRepo.save(booking);
};
