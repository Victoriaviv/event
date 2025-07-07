// Enable metadata reflection for decorators (used by TypeORM and class-validator)
import 'reflect-metadata';

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { AppDataSource } from './ormconfig'; 
import authRoutes from './routes/authRoutes';
import eventRoutes from './routes/eventRoutes';
import bookingRoutes from './routes/bookingRoutes';
import adminRoutes from './routes/adminRoutes';

dotenv.config();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const app = express();


app.use(cors());
app.use(express.json());


const PORT = process.env.PORT || 5000;


AppDataSource.initialize()
  .then(() => {
    console.log('✅ Database connected successfully!');

    app.use('/api/auth', authRoutes);
    app.use('/api/events', eventRoutes);
    app.use('/api/bookings', bookingRoutes);
    app.use('/api/admins', adminRoutes);

   
    app.listen(PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error during Data Source initialization:', err);
  });
