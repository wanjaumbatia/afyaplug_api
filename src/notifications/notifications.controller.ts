import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('notifications')
@ApiTags('Notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('sms')
  findAllSms() {
    return this.notificationsService.findAllSMS();
  }
  @Get('emails')
  findAllEmails() {
    return this.notificationsService.findAllEmails();
  }

}
