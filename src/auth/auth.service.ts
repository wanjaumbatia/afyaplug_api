import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as parser from 'ua-parser-js';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { events } from 'src/constants/events.constants';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class AuthService {

  private readonly s3Client = new S3Client({
    region: this.configSevice.getOrThrow('AWS_S3_REGION')
  });

  constructor(
    private eventEmitter: EventEmitter2,
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly configSevice: ConfigService
  ) { }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (!user) throw new UnauthorizedException();

    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async login(user: any, req: Request, ip: string) {
    const payload = { name: user.name, sub: user.id };
    const ua = parser(req.headers['user-agent']);
    this.eventEmitter.emit(events.LOGGED_IN, {
      user: user,
      data: {
        ipAddress: ip,
        browser: ua.browser.name,
        engine: ua.engine.name,
        os: ua.os.name + ' ' + ua.os.version,
        cpu: ua.cpu.architecture,
        userAgent: req.headers['user-agent'],
      },
    });
    if (user.verified == false) {
      const data = {
        id: user.id,
        name: user.name,
        role: user.role,
        verified: false,
        token: user.resetPasswordToken
      };
      return {
        access_token: this.jwtService.sign(payload),
        user: data,
      };
    } else {
      const data = {
        id: user.id,
        name: user.name,
        role: user.role,
        verified: true
      };
      return {
        access_token: this.jwtService.sign(payload),
        user: data,
      };
    }


  }

  async register(data: RegisterDto, ip: string, req: Request) {
    const user = await this.usersService.create(data);
    const ua = parser(req.headers['user-agent']);
    this.eventEmitter.emit(events.LOGGED_IN, {
      user: user,
      data: {
        ipAddress: ip,
        browser: ua.browser.name,
        engine: ua.engine.name,
        os: ua.os.name + ' ' + ua.os.version,
        cpu: ua.cpu.architecture,
        userAgent: req.headers['user-agent'],
      },
    });
    return user;
  }

  async getUser(user: any) {
    return this.usersService.findOneById(Number(user.userId));
  }

  async verifyAccount(data: VerifyEmailDto, user: any) {
    const userId = Number(user.userId);
    const result = await this.usersService.verifyUserAccount(data.token, data.code, userId);
    if (result == true) {
      return "success";
    } else {
      throw new BadRequestException('Invalid or expired code');
    }

  }

  async sendPasswordResetEmail(email: string) {
    return this.usersService.passwordRestLink(email);
  }

  async resetPassword(token: string, newPassword: string) {
    return this.usersService.resetPassword(token, newPassword);
  }

  async uploadProfileImage(filename: string, file: Buffer) {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: 'afyaplug-files',
        Key: filename,
        Body: file
      })
    )
  }
}
