import { Injectable, Logger } from '@nestjs/common';
import { CreateEmailDto, CreateSmsDto } from './dto/create-notification.dto';
import { UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { SmsMessage } from './entities/sms.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EmailMessage } from './entities/email.entity';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectRepository(SmsMessage) private smsRepository: Repository<SmsMessage>,
    @InjectRepository(EmailMessage)
    private emailRepository: Repository<EmailMessage>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createSMS(createSmsDto: CreateSmsDto) {
    const user = await this.userRepository.findOne({
      where: {
        id: createSmsDto.userId,
      },
    });
    const sms = await this.smsRepository.create();
    sms.phone = createSmsDto.phone;
    sms.message = createSmsDto.message;
    sms.purpose = createSmsDto.purpose;
    sms.user = user;
    return this.smsRepository.save(sms);
  }

  async createEmail(createEmailDto: CreateEmailDto) {
    const user = await this.userRepository.findOne({
      where: {
        id: createEmailDto.userId,
      },
    });
    const email = await this.emailRepository.create();
    email.address = createEmailDto.email;
    email.message = createEmailDto.message;
    email.purpose = createEmailDto.purpose;
    email.user = user;
    return this.emailRepository.save(email);
  }

  findAllSMS() {
    return this.smsRepository.find({ relations: ['user'] });
  }

  findAllEmails() {
    return this.emailRepository.find({ relations: ['user'] });
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async sendSMS() {
    const sms = await this.smsRepository.find({
      where: {
        sent: false,
      },
    });

   // this.logger.debug(`${sms.length} sms to be sent`);
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async sendEmail() {
    const email = await this.emailRepository.find({
      where: {
        sent: false,
      },
    });

    //this.logger.debug(`${email.length} emails to be sent`);
  }
}
