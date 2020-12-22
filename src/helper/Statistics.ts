import { mmt, Moment } from '@/moment';

export const getWeelyDateRangeParams = (params: {
  startDate: Date;
  endDate: Date;
}): DateRange[] => {
  const { startDate, endDate } = params;
  const startDateStrMmt: Moment = mmt(startDate);
  const endDateStrMmt: Moment = mmt(endDate);

  const dayDiff = endDateStrMmt.diff(startDateStrMmt, 'days');
  const startDay = startDateStrMmt.day();
  const endDay = endDateStrMmt.day();
  const weeks: DateRange[] = [];

  if (dayDiff <= 6 && startDay <= endDay) {
    //1개 주
    weeks.push({
      startDate: startDateStrMmt.format('YYYY-MM-DD'),
      endDate: endDateStrMmt.format('YYYY-MM-DD'),
    });
  } else {
    //2개 주 이상
    const weeksCount = (dayDiff - (7 - startDay) - endDay) / 7;
    weeks.push({
      startDate: startDateStrMmt.format('YYYY-MM-DD'),
      endDate: startDateStrMmt.add(6 - startDay, 'days').format('YYYY-MM-DD'),
    });

    for (let i = 0; i < weeksCount; i++) {
      weeks.push({
        startDate: startDateStrMmt.add(1, 'days').format('YYYY-MM-DD'),
        endDate: startDateStrMmt.add(6, 'days').format('YYYY-MM-DD'),
      });
    }

    weeks.push({
      startDate: endDateStrMmt.add(-endDay, 'days').format('YYYY-MM-DD'),
      endDate: endDateStrMmt.add(endDay, 'days').format('YYYY-MM-DD'),
    });
  }
  return weeks;
};
