import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { mmt, Moment } from '@/moment';

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

  async getWeeklyDistance(params: { ids: number[]; weeks: DateRange[] }) {
    const { ids, weeks } = params;
    const shop_ids = ids.join(',');
    const firstStartDate = weeks?.[0].startDate;
    const lastEndDate = weeks?.[weeks.length - 1]?.endDate;

    const legends = {};
    let rawQuery = `
      SELECT
        SHOP_ID,
        SHOP_NAME
    `;

    for (let i = 0, len = weeks.length; i < len; i++) {
      const { startDate, endDate } = weeks[i];
      const alias = `week_${i}`;
      legends[alias] = `${startDate} ~ ${endDate}`;
      rawQuery += `, ROUND(SUM(CASE WHEN DATE_FORMAT(FROM_UNIXTIME(unix_time), '%Y-%m-%d') BETWEEN '${startDate}' AND '${endDate}' THEN mileage ELSE 0 END), 2) "${alias}"`;
    }

    rawQuery += `
      FROM pudu_delivery 
      WHERE shop_id IN (${shop_ids}) AND DATE_FORMAT(FROM_UNIXTIME(unix_time), '%Y-%m-%d') BETWEEN '${firstStartDate}' AND '${lastEndDate}'
      GROUP BY SHOP_ID
      ORDER BY SHOP_NAME;
    `;

    const statistics = await this.deliveryRepository.query(rawQuery);

    const legendKeys = Object.keys(legends);
    const labels = legendKeys.map((key) => legends[key]);

    const datasets = statistics.map((statistic) => ({
      id: statistic['SHOP_ID'],
      label: statistic['SHOP_NAME'],
      data: legendKeys.map((key) => statistic[key]),
    }));

    return {
      labels,
      datasets,
    };
  }

  async getWeeklyCount(params: { ids: number[]; weeks: DateRange[] }) {
    const { ids, weeks } = params;
    const shop_ids = ids.join(',');
    const firstStartDate = weeks?.[0].startDate;
    const lastEndDate = weeks?.[weeks.length - 1]?.endDate;

    const legends = {};
    let rawQuery = `
      SELECT
        details.SHOP_ID,
        details.SHOP_NAME
    `;

    for (let i = 0, len = weeks.length; i < len; i++) {
      const { startDate, endDate } = weeks[i];
      const alias = `week_${i}`;
      legends[alias] = `${startDate} ~ ${endDate}`;
      rawQuery += `, count(CASE WHEN DATE_FORMAT(FROM_UNIXTIME(unix_time), '%Y-%m-%d') BETWEEN '${startDate}' AND '${endDate}' THEN 1 END) "${alias}"`;
    }

    rawQuery += `
      FROM (
        SELECT
          pd.SHOP_ID AS SHOP_ID
          ,pd.SHOP_NAME AS SHOP_NAME
          ,pd.unix_time AS unix_time
        FROM pudu_delivery pd JOIN pudu_delivery_detail pdd ON pd.id = pdd.deliveryId
          WHERE pd.shop_id IN (${shop_ids}) AND DATE_FORMAT(FROM_UNIXTIME(unix_time), '%Y-%m-%d') BETWEEN '${firstStartDate}' AND '${lastEndDate}'
      ) details
      GROUP BY details.SHOP_ID
      ORDER BY details.SHOP_NAME;
    `;

    const statistics = await this.deliveryRepository.query(rawQuery);

    const legendKeys = Object.keys(legends);
    const labels = legendKeys.map((key) => legends[key]);

    const datasets = statistics.map((statistic) => ({
      id: statistic['SHOP_ID'],
      label: statistic['SHOP_NAME'],
      data: legendKeys.map((key) => statistic[key]),
    }));

    return {
      labels,
      datasets,
    };
  }

  async getByDayMileage(params: { ids: number[]; dateList: string[] }) {
    const { ids, dateList } = params;
    const shop_ids = ids.join(',');
    const firstStartDate = dateList?.[0];
    const lastEndDate = dateList?.[dateList.length - 1];
    const days = ['일', '월', '화', '수', '목', '금', '토'];

    const legends = {};
    let rawQuery = `
      SELECT
        SHOP_ID,
        SHOP_NAME
    `;

    for (let i = 0, len = dateList.length; i < len; i++) {
      const date = dateList[i];
      const day = mmt(date).days();
      const alias = `${days[day]}`;
      legends[alias] = `${date}`;
      rawQuery += `, ROUND(SUM(CASE WHEN DATE_FORMAT(FROM_UNIXTIME(unix_time), '%Y-%m-%d') = '${date}' THEN mileage ELSE 0 END), 2) "${alias}"`;
    }

    rawQuery += `
      FROM pudu_delivery 
      WHERE shop_id IN (${shop_ids}) AND DATE_FORMAT(FROM_UNIXTIME(unix_time), '%Y-%m-%d') BETWEEN '${firstStartDate}' AND '${lastEndDate}'
      GROUP BY SHOP_ID
      ORDER BY SHOP_NAME;
    `;

    console.log('rawQuery ::::: ', rawQuery);

    const statistics = await this.deliveryRepository.query(rawQuery);

    const legendKeys = Object.keys(legends);
    const labels = legendKeys.map((key) => `${key} (${legends[key]})`);

    const datasets = statistics.map((statistic) => ({
      id: statistic['SHOP_ID'],
      label: statistic['SHOP_NAME'],
      data: legendKeys.map((key) => statistic[key]),
    }));

    return {
      labels,
      datasets,
    };
  }

  async getByDayCount(params: { ids: number[]; dateList: string[] }) {
    const { ids, dateList } = params;
    const shop_ids = ids.join(',');
    const firstStartDate = dateList?.[0];
    const lastEndDate = dateList?.[dateList.length - 1];
    const days = ['일', '월', '화', '수', '목', '금', '토'];

    const legends = {};
    let rawQuery = `
      SELECT
        details.SHOP_ID,
        details.SHOP_NAME
    `;

    for (let i = 0, len = dateList.length; i < len; i++) {
      const date = dateList[i];
      const day = mmt(date).days();
      const alias = `${days[day]} (${date})`;
      legends[alias] = `${date}`;
      rawQuery += `, count(CASE WHEN DATE_FORMAT(FROM_UNIXTIME(unix_time), '%Y-%m-%d') = '${date}' THEN 1 END) "${alias}"`;
    }

    rawQuery += `
      FROM (
        SELECT
          pd.SHOP_ID AS SHOP_ID
          ,pd.SHOP_NAME AS SHOP_NAME
          ,pd.unix_time AS unix_time
        FROM pudu_delivery pd JOIN pudu_delivery_detail pdd ON pd.id = pdd.deliveryId
          WHERE pd.shop_id IN (${shop_ids}) AND DATE_FORMAT(FROM_UNIXTIME(unix_time), '%Y-%m-%d') BETWEEN '${firstStartDate}' AND '${lastEndDate}'
      ) details
      GROUP BY details.SHOP_ID
      ORDER BY details.SHOP_NAME;
    `;

    const statistics = await this.deliveryRepository.query(rawQuery);

    const legendKeys = Object.keys(legends);
    const labels = legendKeys.map((key) => `${key} (${legends[key]})`);

    const datasets = statistics.map((statistic) => ({
      id: statistic['SHOP_ID'],
      label: statistic['SHOP_NAME'],
      data: legendKeys.map((key) => statistic[key]),
    }));

    return {
      labels,
      datasets,
    };
  }
}
