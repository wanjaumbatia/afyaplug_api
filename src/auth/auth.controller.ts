import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  BadRequestException,
  Ip,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/forgot-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ReaderModel } from "nest-geoip2";
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Body() body: LoginDto, @Ip() ip: string) {
    const user = await this.authService.login(req.user, req, ip);
    return user;
  }

  @Post('register')
  async register(@Request() req, @Body() data: RegisterDto, @Ip() ip: string) {
    const user = await this.authService.register(data, ip, req);
    return this.authService.login(user, req, ip);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('verify-account')
  async verifyAccount(@Body() data: VerifyEmailDto, @Request() req) {
    return this.authService.verifyAccount(data, req.user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('user')
  async User(@Request() req): Promise<any> {
    return this.authService.getUser(req.user);
  }


  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  @Post('upload-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile(
    new ParseFilePipe({
      validators: [
        // new MaxFileSizeValidator({ maxSize: 100000 }),
        // new FileTypeValidator({ fileType: 'image/jpeg' })
      ]
    })
  ) file: Express.Multer.File) {
    if (file == undefined || file == null) {
      throw new BadRequestException("Please provide a file");
    }
    //await this.authService.uploadProfileImage(file.originalname, file.buffer);
  }

  @Post('forgot-password')
  async sendPasswordResetEmail(@Body() data: ForgotPasswordDto) {
    if (!data.email) {
      throw new BadRequestException('Email is required');
    }

    return this.authService.sendPasswordResetEmail(data.email);
  }

  @Post('forgot-password/reset')
  async resetPassword(@Request() req, @Body() data: ResetPasswordDto, @Ip() ip: string) {
    if (!data.token || !data.newPassword) {
      throw new BadRequestException('Token and new password are required');
    }

    const user = this.authService.resetPassword(data.token, data.newPassword);
    return this.authService.login(user, req, ip);
  }

  @Get("ip")
  public async ip(@Ip() ip: string) {
    console.log("ip", ip);
  }
}
