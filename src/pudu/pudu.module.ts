/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PuduController } from '@/pudu/pudu.controller';
import { PuduService } from '@/pudu/pudu.service';
import { DeliveriesController } from '@/pudu/deliveries/deliveries.controller';

@Module({
  controllers: [PuduController, DeliveriesController],
  providers: [PuduService]
})
export class PuduModule {}
