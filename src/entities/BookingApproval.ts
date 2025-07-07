import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Booking } from './Booking';
import { User } from './User';

export enum BookingApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity()
export class BookingApproval {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Booking)
  booking!: Booking;

  @ManyToOne(() => User)
  admin!: User;

  @Column({ type: 'enum', enum: BookingApprovalStatus, default: BookingApprovalStatus.PENDING })
  status!: BookingApprovalStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
} 