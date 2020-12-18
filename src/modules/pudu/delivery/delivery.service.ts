import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

import { Delivery } from './entities/delivery.entity';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';

import { parseIntPageMeta, getRandomColor } from '@/helper/Common';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(Delivery)
    private readonly deliveryRepository: Repository<Delivery>,
  ) {}

  // findAll(): Promise<Delivery[] | undefined> {
  //   return this.deliveryRepository.find({
  //     take: 5,
  //   });
  // }

  async paginate(options: IPaginationOptions): Promise<Pagination<Delivery>> {
    const queryBuilder = this.deliveryRepository.createQueryBuilder('c');
    queryBuilder.orderBy('c.name', 'DESC'); // Or whatever you need to do

    return parseIntPageMeta(await paginate<Delivery>(queryBuilder, options));
  }

  findAll() {
    return this.deliveryRepository.find();
  }

  create(createDeliveryDto: CreateDeliveryDto) {
    console.log('createDeliveryDto ::::: ', createDeliveryDto);
    return this.deliveryRepository.insert(createDeliveryDto);
  }

  findOne(id: number) {
    return `This action returns a #${id} delivery`;
  }

  update(id: number, updateDeliveryDto: UpdateDeliveryDto) {
    return `This action updates a #${id} delivery`;
  }

  remove(id: number) {
    return `This action removes a #${id} delivery`;
  }

  async getStatisticsWeeklyGroupByShops(params: {
    ids: number[];
    weeks: DateRange[];
  }) {
    console.log('params : ', params);
    const { ids, weeks } = params;
    const shop_ids = ids.join(',');
    const firstStartDate = weeks?.[0].startDate;
    const lastEndDate = weeks?.[weeks.length - 1]?.endDate;

    const legends = {};
    let rawQuery = `
      SELECT
        SHOP_NAME
    `;

    for (let i = 0, len = weeks.length; i < len; i++) {
      const { startDate, endDate } = weeks[i];
      const alias = `week_${i}`;
      legends[alias] = `${startDate} ~ ${endDate}`;
      rawQuery += `, ROUND(SUM(CASE WHEN DATE_FORMAT(create_time, '%Y-%m-%d') BETWEEN '${startDate}' AND '${endDate}' THEN mileage ELSE 0 END), 2) "${alias}"`;
    }

    rawQuery += `
      FROM pudu_delivery 
      WHERE shop_id IN (${shop_ids}) AND DATE_FORMAT(create_time, '%Y-%m-%d') BETWEEN '${firstStartDate}' AND '${lastEndDate}'
      GROUP BY SHOP_ID;
    `;

    const statistics = await this.deliveryRepository.query(rawQuery);

    const legendKeys = Object.keys(legends);
    const labels = legendKeys.map((key) => legends[key]);

    const datasets = statistics.map((statistic) => {
      const color = getRandomColor();
      const data = legendKeys.map((key) => statistic[key]);

      return {
        label: statistic['SHOP_NAME'],
        fill: false,
        lineTension: 0.1,
        borderColor: color,
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: color,
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: color,
        pointHoverBorderColor: color,
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data,
      };
    });

    console.log('result : ', {
      labels,
      datasets,
    });

    return {
      labels,
      datasets,
    };
  }
}
