import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from 'src/personel/entities/service.entity';
import { Repository } from 'typeorm';
import { CategoriesService } from '../categories/categories.service';
import {
  CreateServiceDto,
  UpdateServiceDto,
} from 'src/personel/dto/service.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { odoo_constants } from 'src/constants/odoo.constancts';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { Category } from 'src/personel/entities/category.entity';

@Injectable()
export class ServicesService {
  private readonly logger = new Logger(ServicesService.name);
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private categoryService: CategoriesService,
    private httpService: HttpService,
  ) { }

  async create(data: CreateServiceDto) {
    const category = await this.categoryService.findOne(data.categoryId);
    const service = await this.serviceRepository.create({ name: data.name });
    service.category = category;
    return this.serviceRepository.save(service);
  }

  findAll() {
    return this.serviceRepository.find();
  }

  findOne(id: number) {
    return this.serviceRepository.findOne({ where: { id } });
  }

  async update(id: number, data: UpdateServiceDto) {
    const category = await this.categoryService.findOne(data.categoryId);
    return this.serviceRepository.update(id, { ...data, category: category });
  }

  remove(id: number) {
    return this.serviceRepository.softDelete(id);
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async getServicesFromOdoo() {
    const url = odoo_constants.BASE_URL + odoo_constants.SERVICES_URL;
    await this.getServices(url).subscribe(
      async (response) => {
        this.logger.log(
          `${response.data.count} services found in the system.`,
        );
        const services = response.data.data;
        services.forEach(async (element) => {
          console.log(element);
          const record = await this.serviceRepository.findOne({
            where: { name: element.name },
          });
          if (!record) {
            var new_data = {
              name: element.name,
              price: element.standard_price,
              odoo_id: element.id,
            };
            try {
              const category = await this.categoryRepository.findOne({
                where: {
                  odoo_id: element.category_id[0]
                }
              });
              const createdService = await this.serviceRepository.create({
                ...new_data,
              });
              createdService.category = category;
              await this.serviceRepository.save(createdService);
            } catch (error) {
              this.logger.error(`Failed to create ${new_data.name}`);
            }
          } else {
            // Update the record
          }
        });
      },
      (err) => {
        this.logger.error(`Failed to fetch services list`);
      },
    );
  }

  getServices(url): Observable<AxiosResponse> {
    return this.httpService.get(url, {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
