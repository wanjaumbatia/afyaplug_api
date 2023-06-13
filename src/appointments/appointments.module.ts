import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { TimeSlotService } from './time-slots.service';
import { TimeSlotsController } from './time-slot.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeSlot } from './entities/time-slot';
import { Appointment } from './entities/appointment.entity';
import { PersonelModule } from 'src/personel/personel.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([TimeSlot, Appointment]), PersonelModule, UsersModule],
  controllers: [AppointmentsController, TimeSlotsController],
  providers: [AppointmentsService, TimeSlotService]
})
export class AppointmentsModule { }
