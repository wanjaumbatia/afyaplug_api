import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsNumber()
  @ApiProperty()
  categoryId:number;
}

export class UpdateServiceDto {
  @IsString()
  @ApiProperty()
  name: string;
  
  @IsNumber()
  @ApiProperty()
  categoryId:number;
}
