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

import { DeliveryService } from './delivery.service';
import { Delivery } from './entities/delivery.entity';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import {
  getWeelyDateRangeParams,
  getByDaykDateListParams,
} from '@/helper/Statistics';

@Controller('pudu/delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Post()
  create(@Body() createDeliveryDto: CreateDeliveryDto) {
    return this.deliveryService.create(createDeliveryDto);
  }

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

  @Get('/statistics/weekly/distance')
  getStatisticsWeeklyDistance(
    @Query('startDate') startDate = new Date(),
    @Query('endDate') endDate = new Date(),
    @Query('ids') ids = [],
  ) {
    const weeks = getWeelyDateRangeParams({
      startDate,
      endDate,
    });

    return this.deliveryService.getWeeklyDistance({
      ids,
      weeks,
    });
  }

  @Get('/statistics/weekly/count')
  getStatisticsWeeklyCount(
    @Query('startDate') startDate = new Date(),
    @Query('endDate') endDate = new Date(),
    @Query('ids') ids = [],
  ) {
    const weeks = getWeelyDateRangeParams({
      startDate,
      endDate,
    });

    return this.deliveryService.getWeeklyCount({
      ids,
      weeks,
    });
  }

  @Get('/statistics/byDay/distance')
  getStatisticsByDayDistance(
    @Query('startDate') startDate = new Date(),
    @Query('endDate') endDate = new Date(),
    @Query('ids') ids = [],
  ) {
    const dateList = getByDaykDateListParams({
      startDate,
      endDate,
    });

    return this.deliveryService.getByDayMileage({
      ids,
      dateList,
    });
  }

  @Get('/statistics/byDay/count')
  getStatisticsByDayCount(
    @Query('startDate') startDate = new Date(),
    @Query('endDate') endDate = new Date(),
    @Query('ids') ids = [],
  ) {
    const dateList = getByDaykDateListParams({
      startDate,
      endDate,
    });

    console.log('dateList : ', dateList);

    return this.deliveryService.getByDayMileage({
      ids,
      dateList,
    });
  }
}
