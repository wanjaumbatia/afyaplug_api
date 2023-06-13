import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateTimeSlotDto, UpdateTimeSlotDto } from './dto/create-TimeSlot.dto';
import { ApiTags } from '@nestjs/swagger';
import { TimeSlotService } from './time-slots.service';

@Controller('time-slots')
@ApiTags('Time Slots')
export class TimeSlotsController {
    constructor(private readonly timeslotsService: TimeSlotService) { }

    @Get()
    findAll() {
        return this.timeslotsService.findAll();
    }

    @Get(':id/:date')
    findOne(@Param('id') id: string,@Param('date') date: string) {
        return this.timeslotsService.findByPersonnelDate(+id, date);
    }

}
