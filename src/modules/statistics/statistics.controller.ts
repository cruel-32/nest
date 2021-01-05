import { Controller, Get, Post, Param, Query } from '@nestjs/common';
import { StatisticsService } from './statistics.service';

import {
  getWeelyDateRangeParams,
  getByDaykDateListParams,
} from '@/helper/Statistics';
import { mmt, Moment } from '@/moment';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  //2021년 데이터부터는 크롤링시 statistics 데이터도 같이 넣어주도록 코딩되어있지만
  //이전 크롤링한 데이터는 statistics 데이터가 없어서 임의로 생성하도록 하는 임시 api
  @Post('/temp/:YYMM')
  createTmpStatistics(@Param('YYMM') YYMM: string) {
    const startMmt: Moment = mmt(`${YYMM}-01`);

    const startDate = startMmt.toDate();
    const endDate = mmt(`${YYMM}-${startMmt.daysInMonth()}`).toDate();

    getByDaykDateListParams({
      startDate,
      endDate,
    });

    return this.statisticsService.createTmpStatistics(
      getByDaykDateListParams({
        startDate,
        endDate,
      }),
    );
  }

  @Get('/weekly')
  getStatisticsWeekly(
    @Query('startDate') startDate = new Date(),
    @Query('endDate') endDate = new Date(),
    @Query('ids') ids = [],
  ) {
    console.log('startDate :::::: ', startDate);
    console.log('endDate ::::::: ', endDate);

    const weeks = getWeelyDateRangeParams({
      startDate,
      endDate,
    });
    console.log('weeks : ', weeks);

    return this.statisticsService.getWeekly({
      ids,
      weeks,
    });
  }
}
