import { HttpService, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Connection } from 'typeorm';

import { newArray } from '@/helper/Common';
import { CrawlingHelper } from '@/helper/CrawlingHelper';
import { Robot } from '@/modules/pudu/robot/entities/robot.entity';
import { DeliveryLog } from '@/modules/pudu/delivery-log/entities/delivery-log.entity';

import { RobotService } from '@/modules/pudu/robot/robot.service';
import { DeliveryService } from '@/modules/pudu/delivery/delivery.service';

type PuduLoginResult = {
  code?: number;
  msg?: string;
  data?: {
    account: string;
    token: string;
  };
};

type PuduGetListResults = {
  code: number;
  count: number;
  data: Robot[];
};

@Injectable()
export class CrawlerService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly httpService: HttpService,
    private readonly connection: Connection,
  ) {}
  private readonly logger = new Logger(CrawlerService.name);
  private readonly helper = new CrawlingHelper();

  puduToken: string = null;
  keenonToken: string = null;
  timestampList: number[] = [];

  async crawlingPudu(YYYY_MM_DD: string) {
    this.logger.debug(`:::: Create Today ${YYYY_MM_DD} Task ::::`);

    // this.eventEmitter.emit('tasks.createToday', {
    //   date,
    // });
    await this.loginPudu();

    if (this.puduToken) {
      try {
        this.timestampList = [
          this.helper.psTimestamp(YYYY_MM_DD, true),
          this.helper.psTimestamp(YYYY_MM_DD),
        ];

        const robots = [
          {
            id: 99999,
            mac: 'test1',
          },
          {
            id: 99998,
            mac: 'test2',
          },
        ]; //await this.getPuduRobotsAllPage();
        const deliveries = [
          {
            id: 99999999,
            log:
              '{"average":0.6223509379214276,"battery":33,"info":[{"average":0.6223509379214276,"duration":19,"duration_pause":0,"duration_wait":0,"goal_id":"","mileage":9.649551292471735,"order_id":34707722,"status":true,"task_type":3,"theme":"","tray_list":[]}],"mileage":9.649551292471735,"task_id":1607167086,"total_time":19,"hardver":"20.7.14","mac":"C0:84:7D:18:B9:A6","report_number":6626,"softver":"4.11.0.49","timestamp":1607167105,"type":"delivery"}',
            robot_id: 9999,
          },
        ];
        // await this.getPuduDeliveriesAllPageByRobotIds(
        //   robots.map((robot) => robot.id),
        // );

        const result = await this.connection.transaction(async (manager) => {
          const RobotRepository = manager.getRepository('pudu_robot');
          const DeliveryRepository = manager.getRepository('pudu_delivery');
          const DeliveryLogRepository = manager.getRepository(
            'pudu_delivery_log',
          );
          const DeliveryDetailRepository = manager.getRepository(
            'pudu_delivery_detail',
          );

          //robot 입력
          await Promise.all(
            robots.map((robot) => RobotRepository.insert(robot)),
          );

          //delivery 입력 -> deliveryLog 입력 -> deliveryDetail 입력
          //insert를 flat시켜서 모두 Promise.all에 태움
          await Promise.all(
            deliveries
              .map((delivery) => {
                const { id } = delivery;
                const queries = [DeliveryRepository.insert(delivery)];
                const deliveryLog = JSON.parse(delivery.log);
                console.log('deliveryLog ::::: ', deliveryLog);
                // if (deliveryLog) {
                //   queries.push(
                //     DeliveryLogRepository.insert({ id, ...deliveryLog }),
                //   );
                //   const { info } = deliveryLog;
                //   console.log('info ::::: ', deliveryLog);
                //   if (Array.isArray(info)) {
                //     queries.push(
                //       ...info.map((item) =>
                //         DeliveryDetailRepository.insert({
                //           ...item,
                //           deliveryId: id,
                //         }),
                //       ),
                //     );
                //   }
                // }
                return queries;
              })
              .flat(),
          );
        });
        console.log('tranactions result ::::: ', result);
        this.eventEmitter.emit('tasks.update', YYYY_MM_DD, {
          progress: 'completed',
        });
      } catch (error) {
        console.log('error:::::', error);
        this.eventEmitter.emit('tasks.update', YYYY_MM_DD, {
          progress: 'failed',
        });
      }
    }
  }

  async loginPudu() {
    const { data, status } = await this.httpService
      .post<PuduLoginResult>(
        'https://cs.pudutech.com/api/login',
        this.helper.puduLoginParam,
      )
      .toPromise();

    const {
      code,
      data: { token },
    } = data;

    if (status === 200 && code === 0) {
      this.puduToken = token;
    }
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
    return await this.httpService
      .post<PuduGetListResults>(
        'https://cs.pudutech.com/api/robot/bind_shop/page_list',
        { ...this.helper.puduGetRobotsParam, offset },
        {
          headers: {
            authorization: this.puduToken,
          },
        },
      )
      .toPromise();
  }

  async getPuduDeliveriesAllPageByRobotIds(robot_ids = []) {
    return await Promise.all(
      robot_ids.map((robot_id) => this.getPuduDeliveriesAllPage(robot_id)),
    ).then((results) => results.flat());
  }

  async getPuduDeliveriesAllPage(robot_id) {
    const { data } = await this.getPuduDeliveries(0, robot_id);
    const { count, data: list } = data;
    const { limit } = this.helper.puduGetDeliveriesParam;
    const totalPage = Math.floor(count / limit); //2
    const remaining = await Promise.all(
      newArray(totalPage).map((n, i) =>
        this.getPuduDeliveries(limit * (i + 1), robot_id),
      ),
    ).then((results) => results.map((res) => res.data.data).flat());
    list.push(...remaining);
    return list;
  }

  async getPuduDeliveries(offset = 0, robot_id) {
    const param = {
      ...this.helper.puduGetDeliveriesParam,
      offset,
      robot_id,
      timestamp: this.timestampList,
    };

    console.log('param ::::: ', param);
    return await this.httpService
      .post<PuduGetListResults>(
        'https://cs.pudutech.com/api/report/delivery/list',
        param,
        {
          headers: {
            authorization: this.puduToken,
          },
        },
      )
      .toPromise()
      .then((res) => {
        console.log('res : ', res.data);
        return res;
      });
  }
}
