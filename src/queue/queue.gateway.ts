import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayConnection, OnGatewayDisconnect,
} from '@nestjs/websockets';
import { QueueService } from './queue.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    credentials: true,
    origin: "*"
  }
})

export class QueueGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private readonly queueService: QueueService,
  ) {
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinQueue')
  async handleJoinQueue(client: Socket, data: { patientId: number, doctorId: number }) {
    const position = this.queueService.addPatient(data.patientId, data.doctorId);
    const isPatientExists = await this.queueService.isPatientExists(data.patientId);
    if (!data.patientId || !isPatientExists) {
      client.emit('error', { message: 'Patient does not exist' });
      return;
    }
    const users = await this.queueService.getQueue();
    this.server.emit('queueUpdated', users);
  }

  @SubscribeMessage('leaveQueue')
  async handleLeaveQueue(client: Socket, data: { patientId: number }) {
    this.queueService.removePatient(data.patientId);
    const users = await this.queueService.getQueue();
    this.server.emit('queueUpdated', users);
  }

  @SubscribeMessage('getAllPatients')
  async handleGetAllPatients(client: Socket) {
    const users = await this.queueService.getQueue();
    client.emit('queueUpdated', users);
  }
}
