import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateCategoryDto, UpdateCategoryDto } from 'src/personel/dto/category.dto';
import { CategoriesService } from 'src/personel/services/categories/categories.service';

@Controller('categories')
@ApiTags("Categories")
export class CategoriesController {
    constructor(private readonly service: CategoriesService) {}

    @Post()
    create(@Body() data: CreateCategoryDto) {
      return this.service.create(data);
    }
  
    @Get()
    findAll() {
      return this.service.findAll();
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.service.findOne(+id);
    }
  
    @Patch(':id')
    update(@Param('id') id: string, @Body() data: UpdateCategoryDto) {
      return this.service.update(+id, data);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.service.remove(+id);
    }
}
