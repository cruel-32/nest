import {
  Controller,
  Response,
  Get,
  Post,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { rmdirSync } from 'fs';
import delay from 'delay';
import { join } from 'path';

import {
  getWeelyDateRangeParams,
  getByDaykDateListParams,
} from '@/helper/Statistics';

import { ReportService } from './report.service';

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
      startDate: string;
      endDate: string;
      shopIds: string[];
    },
    @Response() res,
  ) {
    const { startDate, endDate, shopIds = [] } = query;
    const xlsxPath = await this.reportService.getReport({
      ids: shopIds.map((id) => +id),
      dateList: getByDaykDateListParams({ startDate, endDate }),
    });
  }
  // @Get()
  // async getReport(
  //   @Query()
  //   query: {
  //     startDate: Date | string;
  //     endDate: Date | string;
  //     statistics: 'byDay' | 'weekly';
  //     shopIds: string[];
  //     path: string;
  //   },
  //   @Response() res,
  // ) {
  //   const { startDate, endDate, statistics, shopIds = [], path } = query;

  //   if (statistics === 'weekly') {
  //     const weeks = getWeelyDateRangeParams({
  //       startDate,
  //       endDate,
  //     });

  //     return this.reportService.createWeeklyReport({
  //       weeks,
  //       ids: shopIds.map((id) => +id),
  //       path,
  //     });
  //   } else if (statistics === 'byDay') {
  //     const dateList = getByDaykDateListParams({
  //       startDate,
  //       endDate,
  //     });

  //     const xlsxPath = await this.reportService.createDayByReport({
  //       ids: shopIds.map((id) => +id),
  //       dateList,
  //       path,
  //     });

  //     res.download(xlsxPath, undefined, () => {
  //       rmdirSync(`${join(__dirname, '../../../')}temp/${path}`, {
  //         recursive: true,
  //       });
  //     });
  //   }
  // }
}
