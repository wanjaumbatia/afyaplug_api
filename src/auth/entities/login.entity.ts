import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class LoginLog {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(() => User, (user) => user.login_logs)
  user: User;

  @Column()
  browser: string;

  @Column()
  engine: string;

  @Column()
  os: string;

  @Column()
  cpu: string;

  @Column()
  userAgent: string;

  @Column()  
  ipAddress: string;

  @CreateDateColumn()
  createdAt: Date;
}
