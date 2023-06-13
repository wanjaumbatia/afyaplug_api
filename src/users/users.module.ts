import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserEventsService } from './events/user.events';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { odoo_constants } from 'src/constants/odoo.constancts';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    NotificationsModule,
    HttpModule,
  ],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService, UserEventsService],
})
export class UsersModule {}
