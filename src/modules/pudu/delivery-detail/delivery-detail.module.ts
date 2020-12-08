import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DeliveryDetailService } from './delivery-detail.service';
import { DeliveryDetailController } from './delivery-detail.controller';
import { DeliveryDetail } from './entities/delivery-detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryDetail])],
  controllers: [DeliveryDetailController],
  providers: [DeliveryDetailService],
})
export class DeliveryDetailModule {}
