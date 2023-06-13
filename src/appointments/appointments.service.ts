import { Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { PersonelService } from 'src/personel/services/personel.service';
import { UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AppointmentsService {

  constructor(
    @InjectRepository(Appointment) private appointmentRepository: Repository<Appointment>,
    private personelService: PersonelService,
    private userService: UsersService
    ) { }

  async create(data: CreateAppointmentDto) {
    /*
     "customerId": 0,
     "personnelId": 0,
     "date": "string",
     "startTime": 0,
     "endTime": 0,
     "longitude": 0,
     "latitude": 0,
     "landmark": "string",
     "area": "string",
     "town": "string",
     "county": "string"
     */

    //get personnel
    const personnel = await this.personelService.findOne(data.personnelId);    
    const user = await this.userService.findOneById(data.customerId);
    const service = personnel.service;
    const category = personnel.category;
    const appointment = await this.appointmentRepository.create()
    appointment.category = category;
    appointment.service = service;
    appointment.personel = personnel;
    appointment.customer = user;
    
    return this.appointmentRepository.save(appointment);
  }

  findAll() {
    return `This action returns all appointments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} appointment`;
  }

  update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    return `This action updates a #${id} appointment`;
  }

  remove(id: number) {
    return `This action removes a #${id} appointment`;
  }
}
