import { PartialType } from '@nestjs/mapped-types';
import { CreateTasksDto } from './create-Tasks.dto';

export class UpdateTasksDto extends PartialType(CreateTasksDto) {
  date: string;
  endDate: string;
  TasksTime: Date;
  progress: 'waiting' | 'running' | 'canceled' | 'completed' | 'failed';
  returnEmail: string;
}
