import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsNumberString, IsString } from "class-validator";

export class VerifyEmailDto {
    @ApiProperty()
    @IsString()
    token:string;

    @ApiProperty()
    @IsNumberString()
    code:string;
}