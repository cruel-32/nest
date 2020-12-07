import { HttpService, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { newArray } from '@/helper/Common';
import { CrawlingHelper } from '@/helper/CrawlingHelper';
import { Robot } from '@/modules/pudu/robot/entities/robot.entity';

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
      this.timestampList = [
        this.helper.psTimestamp(YYYY_MM_DD, true),
        this.helper.psTimestamp(YYYY_MM_DD),
      ];
      const robots = await this.getPuduRobotsAllPage();
      console.log('this.timestampList : ', this.timestampList);
      const deliveries = await this.getPuduDeliveriesAllPageByRobotIds(
        robots.map((robot) => robot.id),
      );

      console.log('deliveries : ', deliveries.length);
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
    return await this.httpService
      .post<PuduGetListResults>(
        'https://cs.pudutech.com/api/report/delivery/list',
        {
          ...this.helper.puduGetDeliveriesParam,
          offset,
          robot_id,
          timestampList: this.timestampList,
        },
        {
          headers: {
            authorization: this.puduToken,
          },
        },
      )
      .toPromise()
      .then((res) => {
        console.log('res : ', res.data.count);
        return res;
      });
  }
}
