import { Module } from '@nestjs/common';
import { HealthService } from './health.service';
import { HealthController } from './health.controller';

import { MessageModule } from '@/modules/message/message.module';

@Module({
  imports: [MessageModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
