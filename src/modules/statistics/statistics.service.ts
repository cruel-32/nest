import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';

import { getByDaykDateListParams } from '@/helper/Statistics';

import { CreateStatisticDto } from './dto/create-statistic.dto';
import { UpdateStatisticDto } from './dto/update-statistic.dto';
import { Statistic } from './entities/statistic.entity';

import { ShopService } from '../pudu/shop/shop.service';

import { mmt, Moment } from '@/moment';

export type Statistics = {
  labels: string[];
  datasets: {
    id: number;
    label: string;
    data: number[];
    stack?: number | string;
  }[];
};

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Statistic)
    private readonly deliveryRepository: Repository<Statistic>,
    private readonly shopService: ShopService,
    private readonly connection: Connection,
  ) {}
  //2021년 데이터부터는 크롤링시 statistics 데이터도 같이 넣어주도록 코딩되어있지만
  //이전 크롤링한 데이터는 statistics 데이터가 없어서 임의로 생성하도록 하는 임시 api
  async createTmpStatistics(dateList: string[]) {
    let mileageRawQuery = `
      SELECT
        SHOP_ID,
        SHOP_NAME
    `;

    for (let i = 0, len = dateList.length; i < len; i++) {
      const date = dateList[i];
      mileageRawQuery += `, SUM(CASE WHEN DATE_FORMAT(FROM_UNIXTIME(unix_time), '%Y-%m-%d') = '${date}' THEN mileage ELSE 0 END) "${date}"`;
    }

    mileageRawQuery += `
      FROM pudu_delivery 
      GROUP BY SHOP_ID
      ORDER BY SHOP_NAME;
    `;

    const mileageStatistics = await this.deliveryRepository.query(
      mileageRawQuery,
    );
    const puduMileagesList = dateList.reduce((object, date) => {
      const mileageByShop = {};

      mileageStatistics.forEach((mileageStatistic) => {
        const { SHOP_ID } = mileageStatistic;
        const dayMileage = mileageStatistic[date];

        mileageByShop[SHOP_ID] = dayMileage || 0;
      });

      object[date] = mileageByShop;
      return object;
    }, {});

    let countRawQuery = `
      SELECT
        details.SHOP_ID,
        details.SHOP_NAME
    `;

    for (let i = 0, len = dateList.length; i < len; i++) {
      const date = dateList[i];
      countRawQuery += `, count(CASE WHEN DATE_FORMAT(FROM_UNIXTIME(unix_time), '%Y-%m-%d') = '${date}' THEN 1 END) "${date}"`;
    }

    countRawQuery += `
      FROM (
        SELECT
          pd.SHOP_ID AS SHOP_ID
          ,pd.SHOP_NAME AS SHOP_NAME
          ,pd.unix_time AS unix_time
        FROM pudu_delivery pd JOIN pudu_delivery_detail pdd ON pd.id = pdd.deliveryId
          WHERE DATE_FORMAT(FROM_UNIXTIME(unix_time), '%Y-%m-%d') BETWEEN '${
            dateList[0]
          }' AND '${dateList[dateList.length - 1]}'
      ) details
      GROUP BY details.SHOP_ID
      ORDER BY details.SHOP_NAME;
    `;

    const countStatistics = await this.deliveryRepository.query(countRawQuery);

    const puduCountsList = dateList.reduce((object, date) => {
      const countByShop = {};

      countStatistics.forEach((countStatistic) => {
        const { SHOP_ID } = countStatistic;
        const dayCount = countStatistic[date];
        countByShop[SHOP_ID] = parseInt(dayCount) || 0;
      });
      object[date] = countByShop;
      return object;
    }, {});

    return await this.connection.transaction(async (manager) => {
      const StatisticsRepository = manager.getRepository('statistics');

      await Promise.all(
        dateList.map((date) => {
          const puduMileages = JSON.stringify(puduMileagesList[date]);
          const puduCounts = JSON.stringify(puduCountsList[date]);

          const entity: CreateStatisticDto = {
            id: date,
            puduMileages,
            puduCounts,
          };

          return StatisticsRepository.save(entity);
        }),
      );
    });
  }

  async getWeekly(params: { ids: number[]; weeks: DateRange[] }) {
    const { ids, weeks } = params;
    const firstStartDate = weeks?.[0].startDate;
    const lastEndDate = weeks?.[weeks.length - 1]?.endDate;
    const shops = await this.shopService.findAllByIds(ids);
    const shopNames = shops.reduce((names, shop) => {
      const { Shop_id, Shop_name } = shop;

      names[Shop_id] = Shop_name;
      return names;
    }, {});

    const rawQuery = `
      SELECT * FROM statistics WHERE DATE_FORMAT(id, '%Y-%m-%d') BETWEEN '${firstStartDate}' AND '${lastEndDate}';
    `;

    const statistics = await this.deliveryRepository.query(rawQuery);

    const statisticData: {
      date: string;
      puduMileages: {
        [key: string]: number;
      };
      puduCounts: {
        [key: string]: number;
      };
    }[] = statistics.map((statistic) => {
      const { id, puduMileages, puduCounts } = statistic;

      return {
        date: id,
        puduMileages: JSON.parse(puduMileages),
        puduCounts: JSON.parse(puduCounts),
      };
    });

    const labels = weeks.map(
      ({ startDate, endDate }) => `${startDate} ~ ${endDate}`,
    );

    const results = ids.reduce<{
      weeklyMileage: Statistics;
      weeklyCount: Statistics;
    }>(
      (resultObject, id) => {
        const commonData = {
          id: +id,
          label: shopNames[id],
        };

        const [mileageDatasets, countsDatasets] = weeks.reduce<number[][]>(
          (datasetsList, week) => {
            const { startDate, endDate } = week;
            const dateList = getByDaykDateListParams({
              startDate,
              endDate,
            });

            let mileages = 0;
            let counts = 0;

            dateList.forEach((date) => {
              const statistic = statisticData.find(
                (statistic) => statistic.date === date,
              );
              if (statistic) {
                const { puduMileages, puduCounts } = statistic;
                mileages += puduMileages?.[id] || 0;
                counts += puduCounts?.[id] || 0;
              }
            });

            datasetsList[0].push(parseFloat(mileages.toFixed(2)));
            datasetsList[1].push(counts);

            return datasetsList;
          },
          [[], []],
        );

        resultObject.weeklyMileage.datasets.push({
          ...commonData,
          data: mileageDatasets,
        });

        resultObject.weeklyCount.datasets.push({
          ...commonData,
          data: countsDatasets,
        });

        return resultObject;
      },
      {
        weeklyMileage: {
          labels,
          datasets: [],
        },
        weeklyCount: {
          labels,
          datasets: [],
        },
      },
    );

    return results;
  }

  async getByDay(params: { ids: number[]; dateList: string[] }) {
    const { ids, dateList } = params;
    const days = ['일', '월', '화', '수', '목', '금', '토'];

    const firstStartDate = dateList?.[0];
    const lastEndDate = dateList?.[dateList.length - 1];
    const shops = await this.shopService.findAllByIds(ids);
    const shopNames = shops.reduce((names, shop) => {
      const { Shop_id, Shop_name } = shop;

      names[Shop_id] = Shop_name;
      return names;
    }, {});

    const rawQuery = `
      SELECT * FROM statistics WHERE DATE_FORMAT(id, '%Y-%m-%d') BETWEEN '${firstStartDate}' AND '${lastEndDate}';
    `;

    const statistics = await this.deliveryRepository.query(rawQuery);

    const statisticData: {
      date: string;
      puduMileages: {
        [key: string]: number;
      };
      puduCounts: {
        [key: string]: number;
      };
    }[] = statistics.map((statistic) => {
      const { id, puduMileages, puduCounts } = statistic;

      return {
        date: id,
        puduMileages: JSON.parse(puduMileages),
        puduCounts: JSON.parse(puduCounts),
      };
    });

    const results = statisticData.reduce<{
      byDayMileage: Statistics;
      byDayCount: Statistics;
    }>(
      (object, item) => {
        const { date, puduMileages, puduCounts } = item;
        const order: Moment = mmt(date);

        ids.forEach((id) => {
          const label = `${shopNames[id]} ${order.weeks()}주차`;

          const hasMileageData = object.byDayMileage.datasets.find(
            (data) => data.label === label,
          );

          const hasCountData = object.byDayCount.datasets.find(
            (data) => data.label === label,
          );

          if (!hasMileageData) {
            object.byDayMileage.datasets.push({
              id: +id,
              label,
              stack: +id,
              data: [puduMileages[id] || 0],
            });
          } else {
            hasMileageData.data.push(puduMileages[id] || 0);
          }

          if (!hasCountData) {
            object.byDayCount.datasets.push({
              id: +id,
              label,
              stack: +id,
              data: [puduCounts[id] || 0],
            });
          } else {
            hasCountData.data.push(puduCounts[id] || 0);
          }
        });

        return object;
      },
      {
        byDayMileage: {
          labels: days,
          datasets: [],
        },
        byDayCount: {
          labels: days,
          datasets: [],
        },
      },
    );

    return results;
  }

  // async getByDay(params: { ids: number[]; dateList: string[] }) {
  //   const { ids, dateList } = params;
  //   const days = ['일', '월', '화', '수', '목', '금', '토'];
  //   console.log('dateList : ', dateList);

  //   const firstStartDate = dateList?.[0];
  //   const lastEndDate = dateList?.[dateList.length - 1];
  //   const shops = await this.shopService.findAllByIds(ids);
  //   const shopNames = shops.reduce((names, shop) => {
  //     const { Shop_id, Shop_name } = shop;

  //     names[Shop_id] = Shop_name;
  //     return names;
  //   }, {});

  //   const rawQuery = `
  //     SELECT * FROM statistics WHERE DATE_FORMAT(id, '%Y-%m-%d') BETWEEN '${firstStartDate}' AND '${lastEndDate}';
  //   `;

  //   const statistics = await this.deliveryRepository.query(rawQuery);

  //   const statisticData: {
  //     date: string;
  //     puduMileages: {
  //       [key: string]: number;
  //     };
  //     puduCounts: {
  //       [key: string]: number;
  //     };
  //   }[] = statistics.map((statistic) => {
  //     const { id, puduMileages, puduCounts } = statistic;

  //     return {
  //       date: id,
  //       puduMileages: JSON.parse(puduMileages),
  //       puduCounts: JSON.parse(puduCounts),
  //     };
  //   });

  //   const labels = dateList.map((date) => {
  //     const day = mmt(date).days();

  //     return `${days[day]} (${date})`;
  //   });

  //   const results = ids.reduce<{
  //     byDayMileage: Statistics;
  //     byDayCount: Statistics;
  //   }>(
  //     (resultObject, id) => {
  //       const commonData = {
  //         id: +id,
  //         label: shopNames[id],
  //       };

  //       const [mileageDatasets, countsDatasets] = dateList.reduce<number[][]>(
  //         (datasetsList, date) => {
  //           const dailiyStatistic = statisticData.find(
  //             (data) => data.date === date,
  //           );

  //           const mileages = +(dailiyStatistic?.puduMileages[id] || 0);
  //           const counts = dailiyStatistic?.puduCounts[id] || 0;

  //           datasetsList[0].push(parseFloat(mileages.toFixed(2)));
  //           datasetsList[1].push(counts);

  //           return datasetsList;
  //         },
  //         [[], []],
  //       );

  //       resultObject.byDayMileage.datasets.push({
  //         ...commonData,
  //         data: mileageDatasets,
  //       });

  //       resultObject.byDayCount.datasets.push({
  //         ...commonData,
  //         data: countsDatasets,
  //       });

  //       return resultObject;
  //     },
  //     {
  //       byDayMileage: {
  //         labels,
  //         datasets: [],
  //       },
  //       byDayCount: {
  //         labels,
  //         datasets: [],
  //       },
  //     },
  //   );

  //   return results;
  // }
}
