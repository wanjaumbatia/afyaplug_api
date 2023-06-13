import { Injectable, Logger } from '@nestjs/common';
import { UpdatePersonelDto } from '../dto/update-personel.dto';
import { Personel } from '../entities/personel.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriesService } from './categories/categories.service';
import { ServicesService } from './services/services.service';
import { CreateNurseTypeParams } from '../dto/types/personel.type';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { odoo_constants } from 'src/constants/odoo.constancts';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UsersService } from 'src/users/users.service';
import { events } from 'src/constants/events.constants';

@Injectable()
export class PersonelService {
  private readonly logger = new Logger(PersonelService.name);
  constructor(
    @InjectRepository(Personel)
    private personnelRepository: Repository<Personel>,
    private servicesService: ServicesService,
    private categoriesService: CategoriesService,
    private readonly httpService: HttpService,
    private userService: UsersService,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(
    data: CreateNurseTypeParams,
    category_id: number,
    service_id: number,
  ) {
    const category = await this.categoriesService.findOne(category_id);
    const service = await this.servicesService.findOne(service_id);
    const nurse = await this.personnelRepository.create({ ...data });
    nurse.category = category;
    nurse.service = service;
    return await this.personnelRepository.save(nurse);
  }

  async findByLocation(longitude: number, latitude: number) {
    const earthRadiusInKm = 6371; // Approximate Earth radius in kilometers

    // Perform the database query to find the closest nurses using the Haversine formula
    const closestNurses = await this.personnelRepository
      .createQueryBuilder('nurse')
      .select('*')
      .addSelect(
        `
          (${earthRadiusInKm} * acos(
            cos(radians(${latitude})) *
            cos(radians(nurse.latitude)) *
            cos(radians(nurse.longitude) - radians(${longitude})) +
            sin(radians(${latitude})) *
            sin(radians(nurse.latitude)))
          ) as distance
        `,
      )
      .orderBy('distance', 'ASC')
      .limit(10) // Limit the results to 10 nurses
      .getRawMany();

    return closestNurses;
  }

  findAll() {
    return this.personnelRepository.find({
      relations: ['category', 'service'],
    });
  }

  async findOne(id: number) {
    const nurse = await this.personnelRepository.findOne({
      where: { id },
      relations: ['category', 'service'],
    });
    return nurse;
  }

  update(id: number, updatePersonelDto: UpdatePersonelDto) {
    return `This action updates a #${id} personel`;
  }

  remove(id: number) {
    return this.personnelRepository.softDelete(id);
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async getPersonelFromDoo() {
    const url = odoo_constants.BASE_URL + odoo_constants.PERSONNEL_URL;
    await this.getPersonnel(url).subscribe(
      async (response) => {
        // this.logger.log(
        //   `${response.data.count} personnel found in the system.`,
        // );
        const personnel = response.data.data;
        personnel.forEach(async (element) => {
          if ((element.active = true)) {
            const record = await this.personnelRepository.findOne({
              where: { nurse_id: element.nurse_id },
            });
            if (!record) {
              var new_data = {
                name: element.name,
                email: element.work_email,
                phone: element.work_phone,
                bio: element.bio,
                location: element.location,
                nurse_id: element.nurse_id,
                gender: element.gender,
                experience: element.experience,
                license_number: element.nurse_license_number,
                price: element.cost,
                active: true,
              };
              try {
                const created_personel = await this.personnelRepository.create({
                  ...new_data,
                });
                await this.personnelRepository.save(created_personel);
                const created_user = await this.userService.create({
                  name: created_personel.name,
                  email: created_personel.email,
                  phone: created_personel.phone,
                  password: '123@Team',
                });
              } catch (error) {
                //this.logger.error(`Failed to create ${new_data.name}`);
              }

              // this.logger.debug(`Create a record for ${element.name}`);
            } else {
              // Update the record
            }
          }
        });
      },
      (err) => {
        // this.logger.error(`Failed to fetch personel list`);
      },
    );
  }

  getPersonnel(url): Observable<AxiosResponse> {
    return this.httpService.get(url, {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
