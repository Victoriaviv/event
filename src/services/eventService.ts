import { Event } from '../entities/Event';
import { AppDataSource } from '../ormconfig';
import { User } from '../entities/User';

const eventRepo = AppDataSource.getRepository(Event);
const userRepo = AppDataSource.getRepository(User);

export const createEvent = async (title: string, description: string, date: string, location: string, totalSeats: number, userId: number) => {
  const user = await userRepo.findOneBy({ id: userId });
  if (!user || (user.role !== 'admin' && user.role !== 'super-admin')) {
    throw new Error('Forbidden');
  }
  const event = eventRepo.create({
    title,
    description,
    date: new Date(date),
    location,
    totalSeats,
    availableSeats: totalSeats,
    createdBy: user,
  });
  return await eventRepo.save(event);
};

export const getAllEvents = async () => {
  return await eventRepo.find({ relations: ['createdBy'] });
};

export const getEventById = async (id: number) => {
  const event = await eventRepo.findOne({ where: { id }, relations: ['createdBy'] });
  if (!event) throw new Error('Event not found');
  return event;
};