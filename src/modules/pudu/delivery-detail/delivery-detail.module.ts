import { Module } from '@nestjs/common';
import { DeliveryDetailService } from './delivery-detail.service';
import { DeliveryDetailController } from './delivery-detail.controller';

@Module({
  controllers: [DeliveryDetailController],
  providers: [DeliveryDetailService]
})
export class DeliveryDetailModule {}
