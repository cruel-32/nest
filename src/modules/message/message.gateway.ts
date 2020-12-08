import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class MessageGateway {
  @WebSocketServer() server;
  taskingId = null;
  taskingTime = null;

  @SubscribeMessage('requestState')
  emitState(client: Socket, message) {
    console.log('req.message', message);
    client.emit('responsetState', {
      taskingId: this.taskingId,
      taskingTime: this.taskingTime,
    });
  }
}
