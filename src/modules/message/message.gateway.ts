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

  @SubscribeMessage('requestState')
  emitState(client: Socket, message) {
    console.log('req.message', message);
    client.emit('responsetState', this.taskingId);
  }

  setState(taskingId) {
    console.log('req.taskingId', taskingId);
    this.taskingId = taskingId;
  }
  getState() {
    console.log('req.taskingId');
    return this.taskingId;
  }
}
