import { Injectable, Logger } from '@nestjs/common';
import { CreateTimeSlotDto, UpdateTimeSlotDto } from './dto/create-timeslot.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { TimeSlot } from './entities/time-slot';
import { Repository } from 'typeorm';
import { PersonelService } from 'src/personel/services/personel.service';

@Injectable()
export class TimeSlotService {

  private readonly logger = new Logger(TimeSlotService.name);
  constructor(
    private readonly personnelService: PersonelService,
    @InjectRepository(TimeSlot) private timeSlotRepository: Repository<TimeSlot>
  ) { };

  findAll() {
    return this.timeSlotRepository.find();
  }

  async findByPersonnelDate(id: number, date: string) {
    console.log(id);
    const slots = await this.timeSlotRepository.find({
      where: {
        personel: {
          id: id
        },
        date: date
      }
    });
    return slots;
  }

  //First 14 days create time slots
  @Cron(CronExpression.EVERY_10_HOURS)
  async getPersonelFromDoo() {
    var start_time = 7;
    var end_time = 19;
    var slots_count = 12;
    const slots = await this.timeSlotRepository.find();
    if (slots.length == 0) {
      var today = new Date();
      //set dates array
      const dates = [];
      const currentDate = new Date();
      for (var i = 0; i < 1; i++) {
        currentDate.setDate(currentDate.getDate() + 1)
        dates.push(currentDate.toLocaleDateString());
      }

      for (var i = 0; i < dates.length; i++) {
        var dt = dates[i];
        const personnel = await this.personnelService.findAll();
        personnel.forEach(async element => {
          for (var i = Number(start_time); i < Number(end_time); i++) {
            const fromString = `${i}:00`;
            const toInt = i + 1;
            const toString = `${toInt}:00`;
            const slot = this.timeSlotRepository.create({
              from: fromString,
              to: toString,
              date: dt,
            });
            slot.personel = element;
            await this.timeSlotRepository.save(slot);
          }
        });
      }
    } else {
      //get last 
      var last_date = new Date(slots[slots.length - 1].date);
      last_date.setDate(last_date.getDate() + 1)
      const dt = last_date.toLocaleDateString();
      const personnel = await this.personnelService.findAll();
      personnel.forEach(async element => {
        for (var i = Number(start_time); i < Number(end_time); i++) {
          const fromString = `${i}:00`;
          const toInt = i + 1;
          const toString = `${toInt}:00`;
          const slot = this.timeSlotRepository.create({
            from: fromString,
            to: toString,
            date: dt,
          });
          slot.personel = element;
          await this.timeSlotRepository.save(slot);
        }
      });
    }

    this.logger.warn(`start time ${start_time}, end time ${end_time}, count ${slots_count}`);
  }

}
