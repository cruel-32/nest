/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PuduController } from './pudu.controller';
import { PuduService } from './pudu.service';
import { DeliveriesController } from './deliveries/deliveries.controller';

@Module({
  controllers: [PuduController, DeliveriesController],
  providers: [PuduService]
})
export class PuduModule {}
