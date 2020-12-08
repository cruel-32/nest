import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DeliveryLogService } from './delivery-log.service';
import { DeliveryLogController } from './delivery-log.controller';
import { DeliveryLog } from './entities/delivery-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryLog])],
  controllers: [DeliveryLogController],
  providers: [DeliveryLogService],
})
export class DeliveryLogModule {}
