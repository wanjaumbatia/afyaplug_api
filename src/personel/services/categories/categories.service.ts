import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { odoo_constants } from 'src/constants/odoo.constancts';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from 'src/personel/dto/category.dto';
import { Category } from 'src/personel/entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private httpService: HttpService
  ) {}

  async create(data: CreateCategoryDto) {
    const category = await this.categoryRepository.create({ ...data });
    return this.categoryRepository.save(category);
  }

  findAll() {
    return this.categoryRepository.find();
  }

  findOne(id: number) {
    return this.categoryRepository.findOne({ where: { id } });
  }

  update(id: number, data: UpdateCategoryDto) {
    return this.categoryRepository.update(id, { ...data });
  }

  remove(id: number) {
    return this.categoryRepository.softDelete(id);
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async getCategoriesFromOdoo() {
    const url = odoo_constants.BASE_URL + odoo_constants.CATEGORIES_URL;
    await this.getCategories(url).subscribe(
      async (response) => {
        this.logger.log(
          `${response.data.count} categories found in the system.`,
        );
        const categories = response.data.data;
        categories.forEach(async (element) => {
          if ((element.active = true)) {
            const record = await this.categoryRepository.findOne({
              where: { name: element.name },
            });
            if (!record) {
              var new_data = {
                name: element.name,
                enabled: element.enable,
                odoo_id: element.id,
              };
              try {
                const created_personel = await this.categoryRepository.create({
                  ...new_data,
                });
                await this.categoryRepository.save(created_personel);
              } catch (error) {
                this.logger.error(`Failed to create ${new_data.name}`);
              }
            } else {
              // Update the record
            }
          }
        });
      },
      (err) => {
        this.logger.error(`Failed to fetch category list`);
      },
    );
  }

  getCategories(url): Observable<AxiosResponse> {
    return this.httpService.get(url, {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
