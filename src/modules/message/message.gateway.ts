import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { mmt } from '@/moment';

@WebSocketGateway()
export class MessageGateway {
  @WebSocketServer() server;
  taskingId = null;
  taskingTime = null;
  interval = null;

  @SubscribeMessage('requestState')
  emitState(client: Socket, message) {
    console.log('req.message', message);
    const now = mmt();
    const runningTime = this.taskingTime
      ? now.diff(this.taskingTime, 'seconds')
      : 0;

    client.emit('responsetState', {
      taskingId: this.taskingId,
      taskingTime: this.taskingTime,
      runningTime,
    });
  }

  emitStateFromServer() {
    const now = mmt();
    const runningTime = this.taskingTime
      ? now.diff(this.taskingTime, 'seconds')
      : 0;

    this.server.emit('responsetState', {
      taskingId: this.taskingId,
      taskingTime: this.taskingTime,
      runningTime,
    });
  }
}
