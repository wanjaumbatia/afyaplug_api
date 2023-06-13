import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class ForgotPasswordDto {
    @ApiProperty()
    @IsEmail()
    email: string;
}

export class ResetPasswordDto {
    @ApiProperty()
    @IsString()
    token:string;

    @ApiProperty()
    @IsString()
    newPassword:string;
}