import {
  Controller,
  Request,
  Response,
  Get,
  Post,
  Body,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { rmdirSync } from 'fs';
import delay from 'delay';

import {
  getWeelyDateRangeParams,
  getByDaykDateListParams,
} from '@/helper/Statistics';

import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post('/upload/tempImages')
  @UseInterceptors(FilesInterceptor('images'))
  async uploadTempImages(@UploadedFiles() images) {
    return this.reportService.uploadImages(images);
  }

  @Get()
  async getReport(
    @Query()
    query: {
      startDate: Date | string;
      endDate: Date | string;
      statistics: 'byDay' | 'weekly';
      shopIds: string[];
      path: string;
    },
    @Response() res,
  ) {
    const { startDate, endDate, statistics, shopIds = [], path } = query;

    if (statistics === 'weekly') {
      const weeks = getWeelyDateRangeParams({
        startDate,
        endDate,
      });

      return this.reportService.createWeeklyReport({
        weeks,
        ids: shopIds.map((id) => +id),
        path,
      });
    } else if (statistics === 'byDay') {
      const dateList = getByDaykDateListParams({
        startDate,
        endDate,
      });

      const xlsxPath = await this.reportService.createDayByReport({
        ids: shopIds.map((id) => +id),
        dateList,
        path,
      });

      res.download(xlsxPath, undefined, () => {
        rmdirSync(`${__dirname}/temp/${path}`, { recursive: true });
      });
    }
  }
}
