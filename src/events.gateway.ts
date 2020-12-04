import { MessageBody, SubscribeMessage } from '@nestjs/websockets';

export class Events {
  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: string): string {
    return data;
  }
}
