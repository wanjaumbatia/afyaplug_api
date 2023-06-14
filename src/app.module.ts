import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NotificationsModule } from './notifications/notifications.module';
import { SmsMessage } from './notifications/entities/sms.entity';
import { EmailMessage } from './notifications/entities/email.entity';
import { AuthModule } from './auth/auth.module';
import { LoginLog } from './auth/entities/login.entity';
import { PersonelModule } from './personel/personel.module';
import { Category } from './personel/entities/category.entity';
import { Service } from './personel/entities/service.entity';
import { Personel } from './personel/entities/personel.entity';
import { HttpModule } from '@nestjs/axios';
import { AppointmentsModule } from './appointments/appointments.module';
import { TimeSlot } from './appointments/entities/time-slot';
import { ConfigModule } from '@nestjs/config';
import { Appointment } from './appointments/entities/appointment.entity';

@Module({
  imports: [
    AppointmentsModule,
    AuthModule,
    PersonelModule,
    UsersModule,
    NotificationsModule,
    ScheduleModule.forRoot(),
    HttpModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      // host: 'localhost',
      // port: 3306,
      // username: 'root',
      // password: '',
      // database: 'app_db',
      host: 'ls-82e8acd89b2b7ee7a1d83094c0e99a7fb17ac2ce.coxvb9fwz3ty.ap-south-1.rds.amazonaws.com',
      port: 3306,
      username: 'root',
      password: 'afyaplug',
      database: 'afyaplug',
      entities: [User, SmsMessage, EmailMessage, LoginLog, Category, Service, Personel, TimeSlot, Appointment],
      synchronize: true,
    }),
    // ThrottlerModule.forRoot({
    //   ttl: 60,
    //   limit: 120,
    // }),
    EventEmitterModule.forRoot(),
    //ConfigModule.forRoot({ isGlobal: true })
  ],
  controllers: [],
  providers: [AppService,],
})
export class AppModule { }
// {
//   provide: APP_GUARD,
//   useClass: ThrottlerGuard
// }
