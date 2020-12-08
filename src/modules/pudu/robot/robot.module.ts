import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RobotService } from './robot.service';
import { RobotController } from './robot.controller';
import { Robot } from './entities/robot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Robot])],
  providers: [RobotService],
  exports: [RobotService],
  controllers: [RobotController],
})
export class RobotModule {}
