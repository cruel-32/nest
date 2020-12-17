import { HttpService, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Connection } from 'typeorm';
import delay from 'delay';
import { Moment } from 'moment';
import { catchError, retry, mergeMap } from 'rxjs/operators';
import { Observable, throwError, of } from 'rxjs';

import { mmt } from '@/moment';
import { newArray } from '@/helper/Common';
import { CrawlingHelper } from '@/helper/PuduCrawlingHelper';
import { MessageGateway } from '../message/message.gateway';

import { Delivery } from '@/modules/pudu/delivery/entities/delivery.entity';
import { Robot } from '@/modules/pudu/robot/entities/robot.entity';
import { Shop } from '@/modules/pudu/shop/entities/shop.entity';

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
  ) {}
  private readonly logger = new Logger(CrawlerService.name);
  private readonly helper = new CrawlingHelper();

  puduToken: string = null;
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
    try {
      this.unixTime = this.helper.psTimestamp(YYYY_MM_DD);
      console.log('this.unixTime : ', this.unixTime);
      await this.loginPudu();
      const shops = await this.getPuduShopsAllPage();
      const robots = await this.getPuduRobotsAllPage();
      const deliveries = await this.getPuduDeliveriesAllPageByRobotIds(
        robots.map((robot) => robot.id),
      );
      const { logs, details } = deliveries.reduce(
        (obj, item) => {
          if (!item) {
            console.log('item : ', item);
            console.log('deliveries : ', deliveries);
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

      console.log('shop length ::::: ', shops.length);
      console.log('robot length ::::: ', robots.length);
      console.log('delivery length ::::: ', deliveries.length);
      console.log('log length ::::: ', logs.length);
      console.log('detail length ::::: ', details.length);

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

        // //database 입력
        await Promise.all(shops.map((shop) => ShopRepository.save(shop)));
        await Promise.all(robots.map((robot) => RobotRepository.save(robot)));
        await Promise.all(
          deliveries.map((delivery) => DeliveryRepository.insert(delivery)),
        );
        await Promise.all(logs.map((log) => DeliveryLogRepository.insert(log)));
        await Promise.all(
          details.map((detail) => DeliveryDetailRepository.insert(detail)),
        );
      });

      const endTime: Moment = mmt();
      endTime.diff(this.messageGateway.taskingTime, 'seconds');

      this.eventEmitter.emit('tasks.update', YYYY_MM_DD, {
        progress: 'completed',
        message: '크롤링 성공',
        runningTime: endTime.diff(this.messageGateway.taskingTime, 'seconds'),
      });
    } catch (error) {
      console.log('error:::::', error);
      const endTime = mmt();
      endTime.diff(this.messageGateway.taskingTime, 'seconds');

      this.eventEmitter.emit('tasks.update', YYYY_MM_DD, {
        progress: 'failed',
        message: error.message,
        runningTime: endTime.diff(this.messageGateway.taskingTime, 'seconds'),
      });
    } finally {
      clearInterval(this.messageGateway.interval);
      this.messageGateway.taskingId = null;
      this.messageGateway.taskingTime = null;
      this.messageGateway.emitStateFromServer();
    }
  }

  async loginPudu() {
    const { data, status } = await this.httpService
      .post<PuduLoginResult>(
        'https://cs.pudutech.com/api/login',
        this.helper.puduLoginParam,
      )
      .pipe(
        mergeMap((res) => {
          this.logger.debug(`:::: Login Result ::::`);
          console.log(res.status);
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
    // .catch(() => {});

    if (status === 200) {
      const { data: tokenData } = data;
      this.puduToken = tokenData?.token;
    }
  }

  async getPuduShopsAllPage() {
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

  async getPuduShops(offset = 0) {
    const param = { ...this.helper.puduGetShopsParam, offset };
    // console.log('param ::::: ', param);

    return await this.httpService
      .post<PuduGetListResults<Shop>>(
        'https://cs.pudutech.com/api/shop/list',
        param,
        {
          headers: {
            authorization: this.puduToken,
            'Content-Type': 'application/json;charset=UTF-8',
          },
        },
      )
      .pipe(
        mergeMap((res) => {
          console.log(
            `limit : ${param.limit}, offset : ${offset}, count: ${res.data.count}, length : ${res.data.data.length}`,
          );
          console.log('PuduGetListResults res.status : ', res.status);
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

  async getPuduRobotsAllPage() {
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

  async getPuduRobots(offset = 0) {
    const param = { ...this.helper.puduGetRobotsParam, offset };
    // console.log('param ::::: ', param);

    return await this.httpService
      .post<PuduGetListResults<Robot>>(
        'https://cs.pudutech.com/api/robot/bind_shop/page_list',
        param,
        {
          headers: {
            authorization: this.puduToken,
            'Content-Type': 'application/json;charset=UTF-8',
          },
        },
      )
      .pipe(
        mergeMap((res) => {
          console.log('PuduGetListResults res.status : ', res.status);
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

  async getPuduDeliveriesAllPageByRobotIds(robot_ids = []) {
    //한번에 불러오지 않고 delay
    const results = [];
    for (let i = 0, len = robot_ids.length; i < len; i++) {
      console.log(`::::: delivery of ${robot_ids[i]} robot :::::`);
      const result = await this.getPuduDeliveriesAllPage(robot_ids[i]);
      // console.log('all page result ::: ', result);
      results.push(...result);
    }
    return results;

    //한번에 불러오기
    // return await Promise.all(
    //   robot_ids.map((robot_id) => this.getPuduDeliveriesAllPage(robot_id)),
    // ).then((results) => results.flat());
  }

  async getPuduDeliveriesAllPage(robot_id) {
    const {
      data: { count },
    } = await this.getPuduDeliveriesCount(0, robot_id);
    const { limit } = this.helper.puduGetDeliveriesParam;
    const totalPage = Math.ceil(count / limit); //2
    const list = [];

    //한번에 불러오지 않고 delay
    for (let i = 0, len = totalPage; i < len; i++) {
      // console.log(`::::: ${robot_id} robot delivery page number ${i}:::::`);
      const result = await this.getPuduDeliveries(limit * i, robot_id);
      console.log(
        `::::: delivery of ${robot_id} robot 페이지넘버 ${i + 1} :::::`,
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

  async getPuduDeliveriesCount(offset = 0, robot_id) {
    const param = {
      ...this.helper.puduGetDeliveriesParam,
      is_get_count: true,
      offset,
      robot_id,
      unix_time: this.unixTime,
    };

    // console.log('param ::::: ', param);
    return await this.httpService
      .post<PuduGetListResults<Delivery>>(
        'https://cs.pudutech.com/api/report/delivery/list',
        param,
        {
          headers: {
            authorization: this.puduToken,
            'Content-Type': 'application/json;charset=UTF-8',
          },
        },
      )
      .pipe(
        mergeMap((res) => {
          console.log('PuduGetListResults res.status : ', res.status);
          if (!res.data) {
            console.log('PuduGetListResults res.data ::: ', res.data.count);
          }
          if (res.status >= 400) {
            return throwError(`${res.status} returned from http call`);
          }
          return of(res);
        }),
        retry(10),
        catchError((err) => {
          console.log('PuduGetListResults err ::: ', err);
          return of(err);
        }),
      )
      .toPromise();
  }

  async getPuduDeliveries(offset = 0, robot_id) {
    const param = {
      ...this.helper.puduGetDeliveriesParam,
      offset,
      robot_id,
      unix_time: this.unixTime,
    };

    // console.log('param ::::: ', param);
    return await this.httpService
      .post<PuduGetListResults<Delivery>>(
        'https://cs.pudutech.com/api/report/delivery/list',
        param,
        {
          headers: {
            authorization: this.puduToken,
            'Content-Type': 'application/json;charset=UTF-8',
          },
        },
      )
      .pipe(
        mergeMap((res) => {
          console.log('PuduGetListResults res.status : ', res.status);
          if (!res.data) {
            console.log('PuduGetListResults res.data ::: ', res.data.count);
          }
          if (res.status >= 400) {
            return throwError(`${res.status} returned from http call`);
          }
          return of(res);
        }),
        retry(10),
        catchError((err) => {
          console.log('PuduGetListResults err ::: ', err);
          return of(err);
        }),
      )
      .toPromise();
  }
}
