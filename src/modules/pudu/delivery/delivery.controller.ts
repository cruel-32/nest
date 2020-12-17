import { Public } from '@/decorators/jwt.decorator';
import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { mmt } from '@/moment';

import { DeliveryService } from './delivery.service';
import { Delivery } from './entities/delivery.entity';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { Moment } from 'moment';

@Controller('pudu/delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Post()
  create(@Body() createDeliveryDto: CreateDeliveryDto) {
    return this.deliveryService.create(createDeliveryDto);
  }

  @Public()
  @Get()
  async find(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Pagination<Delivery>> {
    return this.deliveryService.paginate({
      page,
      limit,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deliveryService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateDeliveryDto: UpdateDeliveryDto,
  ) {
    return this.deliveryService.update(+id, updateDeliveryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deliveryService.remove(+id);
  }

  @Public()
  @Get('/statistics/weekly')
  getStatistics(
    @Query('startDate') startDate = new Date(),
    @Query('endDate') endDate = new Date(),
    @Query('ids') ids = [],
  ) {
    const startDateStrMmt: Moment = mmt(startDate);
    const endDateStrMmt: Moment = mmt(endDate);

    const dayDiff = endDateStrMmt.diff(startDateStrMmt, 'days');
    const startDay = startDateStrMmt.day();
    const endDay = endDateStrMmt.day();
    const weeks: DateRange[] = [];

    if (dayDiff <= 6 && startDay <= endDay) {
      //1개 주
      weeks.push({
        startDate: startDateStrMmt.format('YYYY-MM-DD'),
        endDate: endDateStrMmt.format('YYYY-MM-DD'),
      });
    } else {
      //2개 주 이상
      const weeksCount = (dayDiff - (7 - startDay) - endDay) / 7;
      weeks.push({
        startDate: startDateStrMmt.format('YYYY-MM-DD'),
        endDate: startDateStrMmt.add(6 - startDay, 'days').format('YYYY-MM-DD'),
      });

      for (let i = 0; i < weeksCount; i++) {
        weeks.push({
          startDate: startDateStrMmt.add(1, 'days').format('YYYY-MM-DD'),
          endDate: startDateStrMmt.add(6, 'days').format('YYYY-MM-DD'),
        });
      }

      weeks.push({
        startDate: endDateStrMmt.add(-endDay, 'days').format('YYYY-MM-DD'),
        endDate: endDateStrMmt.add(endDay, 'days').format('YYYY-MM-DD'),
      });
    }

    console.log('weeks ::::::: ', weeks);

    return this.deliveryService.getStatisticsWeeklyGroupByShops({
      ids,
      weeks,
    });
  }
}
