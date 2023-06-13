import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmsMessage } from './entities/sms.entity';
import { User } from 'src/users/entities/user.entity';
import { EmailMessage } from './entities/email.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SmsMessage, User, EmailMessage])],
  exports: [NotificationsService],
  controllers: [NotificationsController],
  providers: [NotificationsService]
})
export class NotificationsModule {}
