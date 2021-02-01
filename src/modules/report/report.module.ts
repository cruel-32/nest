import { Module } from '@nestjs/common';

import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { StatisticsModule } from '../statistics/statistics.module';

@Module({
  imports: [StatisticsModule],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
