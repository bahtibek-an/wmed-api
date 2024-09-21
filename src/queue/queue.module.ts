import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { QueueGateway } from './queue.gateway';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [QueueGateway, QueueService],
})
export class QueueModule {
}
