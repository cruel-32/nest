import { PartialType } from '@nestjs/mapped-types';
import { CreateScheduleDto } from './create-schedule.dto';

export class UpdateScheduleDto extends PartialType(CreateScheduleDto) {
  date: string;
  endDate: string;
  scheduleTime: Date;
  progress: 'waiting' | 'running' | 'canceled' | 'completed' | 'failed';
  returnEmail: string;
}
