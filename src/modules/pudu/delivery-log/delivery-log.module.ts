import { Module } from '@nestjs/common';
import { DeliveryLogService } from './delivery-log.service';
import { DeliveryLogController } from './delivery-log.controller';

@Module({
  controllers: [DeliveryLogController],
  providers: [DeliveryLogService]
})
export class DeliveryLogModule {}
