import { Exclude } from 'class-transformer';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { LoginLog } from 'src/auth/entities/login.entity';
import { EmailMessage } from 'src/notifications/entities/email.entity';
import { SmsMessage } from 'src/notifications/entities/sms.entity';
import { Personel } from 'src/personel/entities/personel.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  name: string;

  @Column({unique: true})
  email: string;

  @Column()
  phone: string;

  @Column({ default: false })
  verified: boolean;

  @Column({ default: true })
  active: boolean;

  @Column({default: 'Customer'})
  role: string;

  @Column()
  avatarUr: string;

  @Column()
  password: string;

  @Column()
  contactId: number;

  @Column({type: 'uuid'})
  resetPasswordToken: string;

  @Column({type:'text'})
  otp: string;

  @Column({default: false})
  contactCreated: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => SmsMessage, (sms) => sms.user)
  sms: SmsMessage[];

  @OneToMany(() => EmailMessage, (email) => email.user)
  emails: EmailMessage[];

  @OneToMany(() => LoginLog, (log) => log.user)
  login_logs: LoginLog[];

  @OneToOne(() => Personel, (personel)=>personel.user)
  personel: Personel;

  @OneToMany(()=>Appointment, (appointment)=>appointment.customer)
  appointments: Appointment[];
}
