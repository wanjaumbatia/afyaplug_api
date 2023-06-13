import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationsService } from 'src/notifications/notifications.service';
import { events } from 'src/constants/events.constants';
import { UsersService } from '../users.service';
import { v4 as uuid } from 'uuid'; 
import { app_contanst } from 'src/constants/app.constants';

@Injectable()
export class UserEventsService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private userService: UsersService,
    private eventEmitter: EventEmitter2,
    private notificationService: NotificationsService,
  ) {}

  @OnEvent('user.created')
  userCreated(user: User) {
    //generate token,
    var nameArr = user.name.split(' ');
    const message = `Welcome ${nameArr[0]}, use ${user.otp} to verify your account.`;
    //send email notification
    this.eventEmitter.emit(events.SEND_EMAIL, {
      userId: user.id,
      email: user.email,
      message: message,
    });
    //send sms notification
    this.eventEmitter.emit(events.SEND_SMS, {
      userId: user.id,
      phone: user.phone,
      message: message,
    });

    this.eventEmitter.emit(events.CREATE_CONTACT, user);
  }

  @OnEvent(events.SEND_SMS)
  sendSMS(payload: any) {
    this.notificationService.createSMS({
      userId: payload.userId,
      message: payload.message,
      phone: payload.phone,
      purpose: 'WELCOME SMS',
    });
  }

  @OnEvent(events.SEND_EMAIL)
  sendEmail(payload: any) {
    this.notificationService.createEmail({
      userId: payload.userId,
      message: payload.message,
      email: payload.email,
      purpose: 'WELCOME EMAIL',
    });
    //save the notification
  }

  @OnEvent(events.PASSWORD_RESET_LINK)
  async passwordResetLink(email: any) {
    const user = await this.userService.findOne(email);
    const token = uuid(); // Generate a unique token
    user.resetPasswordToken = token;
    await this.userRepository.save(user);

    const resetUrl = `${app_contanst.RESET_PASSWORD}/${token}`; // Change the URL to your actual password reset page

    if (user) {
      this.notificationService.createEmail({
        userId: user.id,
        message: `Password reset link sent to ${resetUrl}`,
        email: user.email,
        purpose: 'PASSWERD RESET',
      });
    }
  }

}
