import { mmt } from '@/moment';

export class CrawlingHelper {
  puduLoginParam = {
    account: process.env.PUDU_ID,
    password: process.env.PUDU_PW,
  };
  puduGetRobotsParam = {
    field: [
      'shop_id',
      'pid',
      'name',
      'use_scene',
      'product_code',
      'use_type',
      'group_id',
      'use_end_time',
      'softver',
      'hardver',
      'frozen_time',
      'run_status_time',
    ],
    limit: 50,
    offset: 0,
    order: 'DESC',
    sort: 'id',
  };
  puduGetDeliveriesParam = {
    limit: 50,
    offset: 0,
    order: 'DESC',
    sort: '',
    status: 1,
    task_finish: 1,
    robot_id: null,
    timestamp: [],
  };

  psTimestamp(YYYYMMDD: string, isStart = true): number {
    const timeStamp = mmt(YYYYMMDD).toDate();

    timeStamp.setHours(isStart ? 0 : 23);
    timeStamp.setMinutes(isStart ? 0 : 59);
    timeStamp.setSeconds(isStart ? 0 : 59);

    return parseInt(timeStamp.getTime().toString().substring(0, 10));
  }
}
