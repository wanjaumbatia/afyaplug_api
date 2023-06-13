import { Module } from '@nestjs/common';
import { PersonelService } from './services/personel.service';
import { PersonelController } from './controller/personel.controller';
import { CategoriesController } from './controller/categories/categories.controller';
import { CategoriesService } from './services/categories/categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { ServicesService } from './services/services/services.service';
import { Service } from './entities/service.entity';
import { ServicesController } from './controller/services/services.controller';
import { Personel } from './entities/personel.entity';
import { HttpModule } from '@nestjs/axios';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Service, Personel]), HttpModule, UsersModule],
  exports: [PersonelService],
  controllers: [PersonelController, CategoriesController, ServicesController],
  providers: [PersonelService, CategoriesService, ServicesService],
})
export class PersonelModule { }
