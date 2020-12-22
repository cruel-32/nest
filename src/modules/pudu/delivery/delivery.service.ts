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

import { parseIntPageMeta } from '@/helper/Common';

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

  async geWeeklyDistance(params: { ids: number[]; weeks: DateRange[] }) {
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
      GROUP BY SHOP_ID
      ORDER BY SHOP_NAME;
    `;

    const statistics = await this.deliveryRepository.query(rawQuery);

    const legendKeys = Object.keys(legends);
    const labels = legendKeys.map((key) => legends[key]);

    const datasets = statistics.map((statistic) => ({
      label: statistic['SHOP_NAME'],
      data: legendKeys.map((key) => statistic[key]),
    }));

    console.log('result : ', {
      labels,
      datasets,
    });

    return {
      labels,
      datasets,
    };
  }

  async geWeeklyCount(params: { ids: number[]; weeks: DateRange[] }) {
    const { ids, weeks } = params;
    const shop_ids = ids.join(',');
    const firstStartDate = weeks?.[0].startDate;
    const lastEndDate = weeks?.[weeks.length - 1]?.endDate;

    const legends = {};
    let rawQuery = `
      SELECT
        details.SHOP_NAME
    `;

    for (let i = 0, len = weeks.length; i < len; i++) {
      const { startDate, endDate } = weeks[i];
      const alias = `week_${i}`;
      legends[alias] = `${startDate} ~ ${endDate}`;
      rawQuery += `, count(CASE WHEN DATE_FORMAT(details.create_time, '%Y-%m-%d') BETWEEN '${startDate}' AND '${endDate}' THEN 1 END) "${alias}"`;
    }

    rawQuery += `
      FROM (
        SELECT
          pd.SHOP_ID AS SHOP_ID
          ,pd.SHOP_NAME AS SHOP_NAME
          ,pd.create_time AS create_time
        FROM pudu_delivery pd JOIN pudu_delivery_detail pdd ON pd.id = pdd.deliveryId
          WHERE pd.shop_id IN (${shop_ids}) AND DATE_FORMAT(pd.create_time, '%Y-%m-%d') BETWEEN '${firstStartDate}' AND '${lastEndDate}'
      ) details
      GROUP BY details.SHOP_ID
      ORDER BY details.SHOP_NAME;
    `;

    const statistics = await this.deliveryRepository.query(rawQuery);

    const legendKeys = Object.keys(legends);
    const labels = legendKeys.map((key) => legends[key]);

    const datasets = statistics.map((statistic) => ({
      label: statistic['SHOP_NAME'],
      data: legendKeys.map((key) => statistic[key]),
    }));

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
