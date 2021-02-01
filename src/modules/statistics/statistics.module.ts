import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { Statistic } from './entities/statistic.entity';

import { ShopModule } from '../pudu/shop/shop.module';

@Module({
  imports: [TypeOrmModule.forFeature([Statistic]), ShopModule],
  controllers: [StatisticsController],
  providers: [StatisticsService],
  exports: [StatisticsService],
})
export class StatisticsModule {}
