import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class SmsMessage {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  phone: string;

  @Column({ type: 'text' })
  message: string;

  @Column()
  messageId: string;

  @Column()
  purpose: string;

  @Column({ default: false })
  sent: boolean;

  @Column({ nullable: false })
  sentOn: Date;

  @Column({ default: false })
  delivered: boolean;

  @Column({ nullable: false })
  deliveredOn: Date;

  @Column({ default: false })
  failed: boolean;

  @Column({ type: 'text', nullable: false })
  error: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.sms)
  user: User;
}
