/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';

import { PuduController } from './pudu.controller';
import { PuduService } from './pudu.service';
import { RobotModule } from './robot/robot.module';
import { DeliveryModule } from './delivery/delivery.module';
import { DeliveryLogModule } from './delivery-log/delivery-log.module';
import { DeliveryDetailModule } from './delivery-detail/delivery-detail.module';

@Module({
  controllers: [PuduController],
  providers: [PuduService],
  imports: [RobotModule, DeliveryModule, DeliveryLogModule, DeliveryDetailModule],
})
export class PuduModule {}
