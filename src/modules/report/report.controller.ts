import { Controller, Param, Post, Body } from '@nestjs/common';

import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post('/:statistics')
  create(
    @Param('statistics') statistics,
    @Body() createReportDto: CreateReportDto,
  ) {
    return this.reportService.create(createReportDto, statistics);
  }
}
