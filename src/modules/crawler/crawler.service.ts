import { HttpService, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Connection } from 'typeorm';
import { AxiosResponse } from 'axios';
import { catchError, retry, mergeMap } from 'rxjs/operators';
import { throwError, of } from 'rxjs';
import { InjectContext } from 'nest-puppeteer';
import type { BrowserContext } from 'puppeteer';

import { mmt, Moment } from '@/moment';
import { newArray } from '@/helper/Common';
import { CrawlingHelper } from '@/helper/PuduCrawlingHelper';
import { MessageGateway } from '../message/message.gateway';

import { CreateDeliveryDto } from '@/modules/pudu/delivery/dto/create-delivery.dto';
import { CreateRobotDto } from '@/modules/pudu/robot/dto/create-robot.dto';
import { CreateShopDto } from '@/modules/pudu/shop/dto/create-shop.dto';
import { CreateDeliveryLogDto } from '../pudu/delivery-log/dto/create-delivery-log.dto';
import { CreateDeliveryDetailDto } from '../pudu/delivery-detail/dto/create-delivery-detail.dto';
import { CreateStatisticDto } from '../statistics/dto/create-statistic.dto';

type PuduLoginResult = {
  code?: number;
  msg?: string;
  data?: {
    account: string;
    token: string;
  };
};

type PuduGetListResults<T> = {
  code: number;
  count: number;
  data: T[];
};

@Injectable()
export class CrawlerService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly httpService: HttpService,
    private readonly connection: Connection,
    private readonly messageGateway: MessageGateway,
    @InjectContext() private readonly browserContext: BrowserContext,
  ) {}
  private readonly logger = new Logger(CrawlerService.name);
  private readonly helper = new CrawlingHelper();

  puduToken: string = null;
  puduCookie = '';
  keenonToken: string = null;
  unixTime = 0;

  async crawlingPudu(YYYY_MM_DD: string) {
    this.logger.debug(`:::: Create Today ${YYYY_MM_DD} Task ::::`);

    // this.eventEmitter.emit('tasks.createToday', {
    //   date,
    // });
    this.messageGateway.taskingId = YYYY_MM_DD;
    this.messageGateway.taskingTime = mmt();
    this.messageGateway.interval = setInterval(() => {
      this.messageGateway.emitStateFromServer();
    }, 1000);
    let transactionStartingTime = mmt();
    try {
      this.unixTime = this.helper.psTimestamp(YYYY_MM_DD);
      await this.loginPudu();
      const shops = await this.getPuduShopsAllPage();
      const robots = await this.getPuduRobotsAllPage();
      const deliveries = await this.getPuduDeliveriesAllPageByRobotIds(
        robots
          .filter(({ frozen_time }) => frozen_time === null)
          .map((robot) => {
            const { id, shop_id } = robot;
            const shop = shops.find(({ id }) => id === shop_id);

            return {
              id,
              shop_id: shop.id,
              shop_name: shop.name,
            };
          }),
      );
      const { logs, details } = deliveries.reduce<{
        logs: CreateDeliveryLogDto[];
        details: CreateDeliveryDetailDto[];
      }>(
        (obj, item) => {
          if (!item) {
            return obj;
          }
          const { id } = item;
          const deliveryLog = JSON.parse(item.log);
          if (deliveryLog) {
            obj.logs.push({ ...deliveryLog, id });
            if (deliveryLog.info && Array.isArray(deliveryLog.info)) {
              obj.details.push(
                ...deliveryLog.info.map((info) => ({
                  ...info,
                  deliveryId: id,
                })),
              );
            }
          }
          return obj;
        },
        {
          logs: [],
          details: [],
        },
      );

      const puduMileages = deliveries.reduce((obj, { shop_id, mileage }) => {
        if (obj[shop_id]) {
          obj[shop_id] = obj[shop_id] + mileage;
        } else {
          obj[shop_id] = mileage;
        }
        return obj;
      }, {});

      const puduCounts = deliveries.reduce((obj, { id, shop_id }) => {
        const filteredDetails = details.filter(({ deliveryId }) => {
          return deliveryId == id;
        });

        if (obj[shop_id]) {
          obj[shop_id] = obj[shop_id] + filteredDetails.length;
        } else {
          obj[shop_id] = filteredDetails.length;
        }
        return obj;
      }, {});

      const createStatisticDto: CreateStatisticDto = {
        id: YYYY_MM_DD,
        puduMileages: JSON.stringify(puduMileages),
        puduCounts: JSON.stringify(puduCounts),
      };

      transactionStartingTime = mmt();
      await this.connection.transaction(async (manager) => {
        const ShopRepository = manager.getRepository('pudu_shop');
        const RobotRepository = manager.getRepository('pudu_robot');
        const DeliveryRepository = manager.getRepository('pudu_delivery');
        const DeliveryLogRepository = manager.getRepository(
          'pudu_delivery_log',
        );
        const DeliveryDetailRepository = manager.getRepository(
          'pudu_delivery_detail',
        );
        const StatisticsRepository = manager.getRepository('statistics');

        // //database 입력
        await Promise.all(shops.map((shop) => ShopRepository.save(shop)));
        await Promise.all(robots.map((robot) => RobotRepository.save(robot)));
        await Promise.all(
          deliveries.map((delivery) => DeliveryRepository.save(delivery)),
        );
        await Promise.all(logs.map((log) => DeliveryLogRepository.save(log)));
        await Promise.all(
          details.map((detail) => DeliveryDetailRepository.insert(detail)),
        );

        await StatisticsRepository.save(createStatisticDto);
      });

      const endTime: Moment = mmt();
      endTime.diff(this.messageGateway.taskingTime, 'seconds');

      this.eventEmitter.emit('tasks.update', YYYY_MM_DD, {
        progress: 'completed',
        message: '크롤링 성공',
        runningTime: endTime.diff(this.messageGateway.taskingTime, 'seconds'),
        transactionTime: transactionStartingTime.diff(
          this.messageGateway.taskingTime,
          'seconds',
        ),
      });
    } catch (error) {
      console.log('error:::::', error);
      const endTime = mmt();
      endTime.diff(this.messageGateway.taskingTime, 'seconds');

      this.eventEmitter.emit('tasks.update', YYYY_MM_DD, {
        progress: 'failed',
        message: error.message,
        runningTime: endTime.diff(this.messageGateway.taskingTime, 'seconds'),
        transactionTime: transactionStartingTime.diff(
          this.messageGateway.taskingTime,
          'seconds',
        ),
      });
    } finally {
      clearInterval(this.messageGateway.interval);
      this.messageGateway.taskingId = null;
      this.messageGateway.taskingTime = null;
      this.messageGateway.emitStateFromServer();
    }
  }

  async loginPudu() {
    const { account, password } = this.helper.puduLoginParam;
    const page = await this.browserContext.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    console.log('start');
    await page.goto(
      'https://oauth2.pudutech.com/login?redirect_url=https%3A%2F%2Fcs.pudutech.com%2Flogin_success&appid=9686827',
    );
    await page.waitForSelector('.el-form input[type=text]');
    //form input 값이 아닌 vue안에 상태값으로 로그인을 하기 때문에
    //input 값을 바꿔주고 로그인 버튼을 눌러봤자 소용없음... 직접 키보드 이벤트를 발생시켜서
    //vue 이벤트를 타고 vue 상태값을 변현하게끔 구현해야함...
    const idForm = await page.$('.el-form input[type=text]');
    const psForm = await page.$('.el-form input[type=password]');

    await idForm.focus();
    await page.keyboard.type(account);
    await psForm.focus();
    await page.keyboard.type(password);
    await page.keyboard.press('Enter');
    await page.waitForSelector('.welcome');
    const cookies = await page.cookies();
    this.puduToken = cookies.find((item) => item?.name === 'loginToken')?.value;
    this.puduCookie = cookies.reduce<string>((cookie, item) => {
      cookie += `${item.name}=${item.value}; `;
      return cookie;
    }, '');

    page.close();
    return;
  }

  // async loginPudu() {
  //   const { data, status } = await this.httpService
  //     .post<PuduLoginResult>(
  //       'https://cs.pudutech.com/api/login',
  //       this.helper.puduLoginParam,
  //     )
  //     .pipe(
  //       mergeMap((res) => {
  //         this.logger.debug(`:::: Login Result ::::`);
  //         console.log(res.status);
  //         if (res.status >= 400) {
  //           return throwError(`${res.status} returned from http call`);
  //         }
  //         return of(res);
  //       }),
  //       retry(10),
  //       catchError((err) => {
  //         return of(err);
  //       }),
  //     )
  //     .toPromise();
  //   // .catch(() => {});

  //   if (status === 200) {
  //     const { data: tokenData } = data;
  //     this.puduToken = tokenData?.token;
  //   }
  // }

  async getPuduShopsAllPage(): Promise<CreateShopDto[]> {
    const { data } = await this.getPuduShops();
    console.log('CrawlerService ~ getPuduShopsAllPage ~ data', data);
    const { count, data: list } = data;
    const { limit } = this.helper.puduGetShopsParam;
    const totalPage = Math.floor(count / limit); //2
    const remaining = await Promise.all(
      newArray(totalPage).map((n, i) => this.getPuduShops(limit * (i + 1))),
    ).then((results) => results.map((res) => res.data.data).flat());
    list.push(...remaining);
    return list;
  }

  async getPuduShops(
    offset = 0,
  ): Promise<AxiosResponse<PuduGetListResults<CreateShopDto>>> {
    const param = { ...this.helper.puduGetShopsParam, offset };
    console.log('this.puduCookie ::::: ', this.puduCookie);

    return await this.httpService
      .post<PuduGetListResults<CreateShopDto>>(
        'https://cs.pudutech.com/api/shop/list',
        param,
        {
          headers: {
            authorization: this.puduToken,
            'Content-Type': 'application/json;charset=UTF-8',
            Cookie: this.puduCookie,
          },
        },
      )
      .pipe(
        mergeMap((res) => {
          console.log(
            `limit : ${param.limit}, offset : ${offset}, count: ${res.data.count}, length : ${res.data.data.length}`,
          );
          console.log('getPuduShops res.status : ', res.status);
          if (res.status >= 400) {
            return throwError(`${res.status} returned from http call`);
          }
          return of(res);
        }),
        retry(10),
        catchError((err) => {
          return of(err);
        }),
      )
      .toPromise();
  }

  async getPuduRobotsAllPage(): Promise<CreateRobotDto[]> {
    const { data } = await this.getPuduRobots();
    const { count, data: list } = data;
    const { limit } = this.helper.puduGetRobotsParam;
    const totalPage = Math.floor(count / limit); //2
    const remaining = await Promise.all(
      newArray(totalPage).map((n, i) => this.getPuduRobots(limit * (i + 1))),
    ).then((results) => results.map((res) => res.data.data).flat());
    list.push(...remaining);
    return list;
  }

  async getPuduRobots(
    offset = 0,
  ): Promise<AxiosResponse<PuduGetListResults<CreateRobotDto>>> {
    const param = { ...this.helper.puduGetRobotsParam, offset };
    // console.log('param ::::: ', param);

    return await this.httpService
      .post<PuduGetListResults<CreateRobotDto>>(
        'https://cs.pudutech.com/api/robot/bind_shop/page_list',
        param,
        {
          headers: {
            authorization: this.puduToken,
            'Content-Type': 'application/json;charset=UTF-8',
            Cookie: this.puduCookie,
          },
        },
      )
      .pipe(
        mergeMap((res) => {
          console.log('getPuduRobots res.status : ', res.status);
          if (res.status >= 400) {
            return throwError(`${res.status} returned from http call`);
          }
          return of(res);
        }),
        retry(10),
        catchError((err) => {
          return of(err);
        }),
      )
      .toPromise();
  }

  async getPuduDeliveriesAllPageByRobotIds(
    robot_ids: {
      id: number;
      shop_id: number;
      shop_name: string;
    }[] = [],
  ): Promise<CreateDeliveryDto[]> {
    //한번에 불러오지 않고 delay
    const results: CreateDeliveryDto[] = [];
    for (let i = 0, len = robot_ids.length; i < len; i++) {
      const robot = robot_ids[i];
      const { id: robot_id, shop_id, shop_name } = robot;

      console.log(`::::: delivery of ${robot_id} robot :::::`);
      const result = await this.getPuduDeliveriesAllPage(robot_id);

      // console.log('all page result ::: ', result);

      //robot_id와 shop_id, shop_name을 pudu쪽 api에서 빼버리는 바람에 직접 추가해줘야함.
      results.push(
        ...result.map((result) => ({
          ...result,
          robot_id,
          shop_id,
          shop_name,
        })),
      );
    }
    return results;

    //한번에 불러오기
    // return await Promise.all(
    //   robot_ids.map((robot_id) => this.getPuduDeliveriesAllPage(robot_id)),
    // ).then((results) => results.flat());
  }

  async getPuduDeliveriesAllPage(robot_id): Promise<CreateDeliveryDto[]> {
    const {
      data: { count },
    } = await this.getPuduDeliveriesCount(0, robot_id);
    const { limit } = this.helper.puduGetDeliveriesParam;
    const totalPage = Math.ceil(count / limit); //2
    const list: CreateDeliveryDto[] = [];

    //한번에 불러오지 않고 delay
    for (let i = 0, len = totalPage; i < len; i++) {
      // console.log(`::::: ${robot_id} robot delivery page number ${i}:::::`);
      const result = await this.getPuduDeliveries(limit * i, robot_id);
      console.log(
        `::::: delivery of ${robot_id} robot 페이지넘버 ${
          i + 1
        } -> total count : ${
          result.data.data.length
        } deliveries id : ${result.data.data
          .map(({ id }) => id)
          .join(',')} :::::`,
      );
      list.push(...result.data.data);
    }

    //한번에 불러오기
    // const remaining = await Promise.all(
    //   newArray(totalPage).map((n, i) =>
    //     this.getPuduDeliveries(limit * (i + 1), robot_id),
    //   ),
    // ).then((results) => results.map((res) => res.data.data).flat());
    // list.push(...remaining);

    return list;
  }

  async getPuduDeliveriesCount(
    offset = 0,
    robot_id,
  ): Promise<AxiosResponse<PuduGetListResults<CreateDeliveryDto>>> {
    const param = {
      ...this.helper.puduGetDeliveriesParam,
      is_get_count: true,
      offset,
      robot_id,
      unix_time: this.unixTime,
    };

    // console.log('param ::::: ', param);
    return await this.httpService
      .post<PuduGetListResults<CreateDeliveryDto>>(
        'https://cs.pudutech.com/api/report/delivery/list',
        param,
        {
          headers: {
            authorization: this.puduToken,
            'Content-Type': 'application/json;charset=UTF-8',
            Cookie: this.puduCookie,
          },
        },
      )
      .pipe(
        mergeMap((res) => {
          console.log('getPuduDeliveriesCount res.status : ', res.status);
          if (!res.data) {
            console.log('getPuduDeliveriesCount res.data ::: ', res.data.count);
          }
          if (res.status >= 400) {
            return throwError(`${res.status} returned from http call`);
          }
          return of(res);
        }),
        retry(10),
        catchError((err) => {
          console.log('getPuduDeliveriesCount err ::: ', err);
          return of(err);
        }),
      )
      .toPromise();
  }

  async getPuduDeliveries(
    offset = 0,
    robot_id,
  ): Promise<AxiosResponse<PuduGetListResults<CreateDeliveryDto>>> {
    const param = {
      ...this.helper.puduGetDeliveriesParam,
      offset,
      robot_id,
      unix_time: this.unixTime,
    };

    // console.log('param ::::: ', param);
    return await this.httpService
      .post<PuduGetListResults<CreateDeliveryDto>>(
        'https://cs.pudutech.com/api/report/delivery/list',
        param,
        {
          headers: {
            authorization: this.puduToken,
            'Content-Type': 'application/json;charset=UTF-8',
            Cookie: this.puduCookie,
          },
        },
      )
      .pipe(
        mergeMap((res) => {
          console.log('getPuduDeliveries res.status : ', res.status);
          if (!res.data) {
            console.log(
              'getPuduDeliveries robot_ids ::: ',
              res.data.data.map((item) => item.robot_id).join(),
            );
          }
          if (res.status >= 400) {
            return throwError(`${res.status} returned from http call`);
          }
          return of(res);
        }),
        retry(10),
        catchError((err) => {
          console.log('getPuduDeliveries err ::: ', err);
          return of(err);
        }),
      )
      .toPromise();
  }
}
