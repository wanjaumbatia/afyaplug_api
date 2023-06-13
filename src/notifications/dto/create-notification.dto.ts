import { IsString, IsPhoneNumber, IsNumber, IsEmail } from 'class-validator';

export class CreateSmsDto {
  @IsPhoneNumber()
  phone: string;

  @IsString()
  message: string;

  @IsNumber()
  userId: number;

  @IsString()
  purpose: string;
}

export class CreateEmailDto {
  @IsEmail()
  email: string;

  @IsString()
  message: string;

  @IsNumber()
  userId: number;
  
  @IsString()
  purpose: string;
}
