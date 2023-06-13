import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @ApiProperty()
  name: string;
}

export class UpdateCategoryDto {
  @IsString()
  @ApiProperty()
  name: string;
}
