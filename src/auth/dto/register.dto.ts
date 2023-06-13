import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsPhoneNumber, IsString } from 'class-validator';

export class RegisterDto {
  @ApiProperty()
  @IsString()
  name: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @ApiProperty()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty()
  @IsString()
  password: string;
}
