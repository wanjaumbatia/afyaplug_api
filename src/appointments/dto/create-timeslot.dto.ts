import { ApiProperty, PartialType } from '@nestjs/swagger';
export class CreateTimeSlotDto {

    @ApiProperty()
    from: string;

    @ApiProperty()
    to: string;
 }

export class UpdateTimeSlotDto { }
