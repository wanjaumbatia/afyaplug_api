import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsPhoneNumber,
  IsString,
  IsLatitude,
  IsLongitude,
  IsNumber,
} from 'class-validator';
export class CreatePersonelDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @IsString()
  title: string;

  @ApiProperty()
  bio: string;

  @ApiProperty()
  location: string;

  @ApiProperty()
  @IsString()
  gender: string;

  @ApiProperty()
  @IsString()
  license_number: string;

  @IsNumber()
  @ApiProperty()
  experience:number;
  
  @ApiProperty()
  @IsLongitude()
  longitude:number;

  @ApiProperty()
  @IsLatitude()
  latitude:number;

  
  @ApiProperty()
  category_id: number;

  @ApiProperty()
  service_id: number;
}
