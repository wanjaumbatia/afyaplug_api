import { User } from 'src/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EmailMessage {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  address: string;
  
  @Column({ type: 'text' })
  message: string;
  
  @Column()
  purpose: string;

  @Column({ default: false })
  sent: boolean;

  @Column({ nullable: false })
  sentOn: Date;

  @Column({ default: false })
  failed: boolean;

  @Column({ type: 'text', nullable: false })
  error: string;

  @CreateDateColumn()
  createdAt: Date;

  
  @ManyToOne(() => User, (user) => user.sms)
  user: User;
}
