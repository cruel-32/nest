import { mmt } from '@/moment';

export class CrawlingHelper {
  puduLoginParam = {
    account: process.env.PUDU_ID,
    password: process.env.PUDU_PW,
  };
  puduGetShopsParam = {
    field: [
      'sn',
      'sys_sn',
      'operation_status',
      'grade',
      'shop_type',
      'cuisine',
      'robot_count',
      'robot_use_type',
      'grade',
    ],
    limit: 50,
    offset: 0,
    order: 'DESC',
    sort: 'grade',
    status: 1,
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
    is_get_count: false,
    is_show_all_field: true,
    limit: 50,
    offset: 0,
    robot_id: 3818,
    time_type: 'day',
    unix_time: 1606748400,
  };

  psTimestamp(YYYYMMDD: string, isStart = true): number {
    const timeStamp = mmt(YYYYMMDD).toDate();

    timeStamp.setHours(isStart ? 0 : 23);
    timeStamp.setMinutes(isStart ? 0 : 59);
    timeStamp.setSeconds(isStart ? 0 : 59);

    console.log('timeStamp : ', timeStamp);

    return parseInt(timeStamp.getTime().toString().substring(0, 10));
  }
}
