import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { events } from 'src/constants/events.constants';
import { Cron, CronExpression } from '@nestjs/schedule';
import { odoo_constants } from 'src/constants/odoo.constancts';
import { HttpService } from '@nestjs/axios';
import { Observable, map } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class UsersService {

  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly httpService: HttpService,
    private eventEmitter: EventEmitter2,
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {
      const hash = await bcrypt.hash(createUserDto.password, 12);
      const token = uuid();
      const otp = '123456';
      const user = this.userRepository.create({
        ...createUserDto,
        password: hash,
        resetPasswordToken: token,
        otp: otp
      });
      const created_user = await this.userRepository.save(user);
      this.eventEmitter.emit(events.USER_CREATED, created_user);
      return created_user;
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('Email already exists');
      } else {
        throw new BadRequestException(err.message);
      }
    }
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  findOneById(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, { ...updateUserDto });
  }

  remove(id: number) {
    return this.userRepository.softDelete(id);
  }

  async verifyUserAccount(token: string, code: string, userId: number) {
    
    const user = await this.userRepository.findOne({ where: { resetPasswordToken: token } });    
    if(user.id != userId){    
      return false;
    }
    console.log(code, user.otp);    
    if (user.otp == code) {
      user.verified = true;
      await this.userRepository.update(user.id, { verified: true, otp: '', resetPasswordToken: ''});
      return true;
    } else {
      return false;
    }
  }

  passwordRestLink(email: string) {
    this.eventEmitter.emit(events.PASSWORD_RESET_LINK, email);
    return 'Password reset link sent successfully.';
  }

  async resetPassword(token: string, newPassword: string) {
    //const hash = await bcrypt.hash(newPassword, 12);
    const user = await this.userRepository.findOne({
      where: {
        resetPasswordToken: token,
      },
    });
    if (!user) {
      throw new BadRequestException(`User not found.`);
    }
    user.password = newPassword;
    return this.userRepository.save(user);
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async createOdooContact() {
    const users = await this.userRepository.find({
      where: {
        contactCreated: false,
      },
    });
    this.createContacts(users);
    this.logger.log(`${users.length} user records to be sent to Odoo`);
  }

  createContacts(users: User[]) {
    users.forEach(async (element) => {
      const data = JSON.stringify({
        name: element.name,
        email: element.email,
        phone: element.phone,
      });

      const url = odoo_constants.BASE_URL + odoo_constants.CREATE_CONTACT_URL;
      await this.postRequest(url, data).subscribe(
        async (response) => {
          await this.userRepository.update(element.id, {
            contactId: response.data.contact,
            contactCreated: true,
          });
        },
        (err) => {
          this.logger.error(`Failed to create contact for ${element.name}`);
        },
      );
    });
  }

  postRequest(url, data): Observable<AxiosResponse> {
    return this.httpService.post(url, data, {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
