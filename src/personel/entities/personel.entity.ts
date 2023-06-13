import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Service } from './service.entity';
import { TimeSlot } from 'src/appointments/entities/time-slot';
import { Appointment } from 'src/appointments/entities/appointment.entity';

@Entity()
export class Personel {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  phone: string;

  @Column({ nullable: false })
  email: string;

  @Column({ type: 'text' })
  bio: string;

  @Column()
  location: string;

  @Column({ nullable: false })
  nurse_id: string;

  @Column()
  gender: string;

  @Column()
  experience: number;

  @Column()
  certifications: string;

  @Column()
  license_number: string;

  @Column()
  date_of_birth: Date;

  @Column()
  town: string;

  @Column()
  county: string;

  @Column()
  picture: string;

  @Column({ default: false })
  verified: boolean;

  @Column({ default: false })
  active: boolean;

  @Column({ default: false })
  available: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 1, nullable: true })
  rating: number;

  @OneToOne(() => User, (user) => user.personel)
  user: User;

  @ManyToOne(() => Category, (category) => category.personel)
  category: Category;

  @ManyToOne(() => Service, (service) => service.personel)
  service: Service;

  @Column()
  photo_avatar: string;

  @OneToMany(() => TimeSlot, (slot) => slot.personel)
  slots: TimeSlot[];
  
  @OneToMany(() => Appointment, (appointment) => appointment.personel)
  appointments: Appointment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column()
  isPremise: true;

  @Column({ type: 'float' })
  longitude: number;

  @Column({ type: 'float' })
  latitude: number;
}
