import { Module } from '@nestjs/common';
import { PuppeteerModule } from 'nest-puppeteer';

import { ReportService } from './report.service';
import { ReportController } from './report.controller';

@Module({
  imports: [PuppeteerModule.forRoot()],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
