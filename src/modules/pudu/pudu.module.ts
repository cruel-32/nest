/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PuduController } from '@/modules/pudu/pudu.controller';
import { PuduService } from '@/modules/pudu/pudu.service';
import { DeliveriesController } from '@/modules/pudu/deliveries/deliveries.controller';

@Module({
  controllers: [PuduController, DeliveriesController],
  providers: [PuduService]
})
export class PuduModule {}
