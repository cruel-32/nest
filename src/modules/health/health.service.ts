import { Injectable } from '@nestjs/common';

import { MessageGateway } from '../message/message.gateway';

@Injectable()
export class HealthService {
  constructor(private readonly messageGateway: MessageGateway) {}

  getServerHealth() {
    return {
      status: 200,
      server: this.messageGateway.taskingId ? '크롤링중' : '정상',
    };
  }
}
