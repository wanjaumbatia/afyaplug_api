import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CreatePersonelDto } from '../dto/create-personel.dto';
import { UpdatePersonelDto } from '../dto/update-personel.dto';
import { ApiTags } from '@nestjs/swagger';
import { PersonelService } from '../services/personel.service';

@Controller('personnel')
@ApiTags('Personnel')
export class PersonelController {
  constructor(private readonly personelService: PersonelService) {}

  @Post()
  create(@Body() createPersonelDto: CreatePersonelDto) {
    return this.personelService.create(
      createPersonelDto,
      createPersonelDto.category_id,
      createPersonelDto.service_id,
    );
  }

  @Get()
  findAll() {
    return this.personelService.findAll();
  }

  @Get('location')
  async findByLocation(
    @Query('longitude') longitude: number,
    @Query('latitude') latitude: number,
  ) {
    return this.personelService.findByLocation(longitude, latitude);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.personelService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePersonelDto: UpdatePersonelDto) {
    return this.personelService.update(+id, updatePersonelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.personelService.remove(+id);
  }
}
