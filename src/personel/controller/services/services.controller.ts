import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateServiceDto, UpdateServiceDto } from 'src/personel/dto/service.dto';
import { ServicesService } from 'src/personel/services/services/services.service';

@Controller('services')
@ApiTags("Services")
export class ServicesController {
    constructor(private readonly service: ServicesService) {}

    @Post()
    create(@Body() data: CreateServiceDto) {
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
    update(@Param('id') id: string, @Body() data: UpdateServiceDto) {
      return this.service.update(+id, data);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.service.remove(+id);
    }
}
