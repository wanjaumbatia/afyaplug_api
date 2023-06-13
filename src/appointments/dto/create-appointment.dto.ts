import { ApiProperty } from "@nestjs/swagger";
import { IsLatitude, IsLongitude, IsNumber, IsString, isLongitude } from "class-validator";

export class CreateAppointmentDto {
    @ApiProperty()
    @IsNumber()
    customerId: number;

    @ApiProperty()
    @IsNumber()
    personnelId: number;
    
    @ApiProperty()
    @IsString()
    date: string;

    @ApiProperty()
    @IsNumber()
    startTime: number;
    
    @ApiProperty()
    @IsNumber()
    endTime: number;
    
    @ApiProperty()
    @IsLongitude()
    longitude: number;
      
    @ApiProperty()
    @IsLatitude()
    latitude: number;

    @ApiProperty()
    landmark: string;

    @ApiProperty()
    area: string;

    @ApiProperty()
    town: string;

    @ApiProperty()
    county: string;    
}
