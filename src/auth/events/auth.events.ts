import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { events } from 'src/constants/events.constants';
import { LoginLog } from 'src/auth/entities/login.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserEventsService {
  constructor(
    @InjectRepository(LoginLog) private loginRepository: Repository<LoginLog>,
  ) {}

  @OnEvent(events.LOGGED_IN)
  async userLoginEvent(payload: any) {
    const data = payload.data;
    const login = await this.loginRepository.create();
    login.ipAddress = data.ipAddress;
    login.browser = data.browser;
    login.cpu = data.cpu;
    login.engine = data.engine;
    login.os = data.os;
    login.userAgent = data.userAgent;
    login.user = payload.user;

    return this.loginRepository.save(login);
  }
}
