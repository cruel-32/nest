export class CreateTasksDto {
  date: string;
  endDate: string;
  TasksTime: Date;
  progress: 'waiting' | 'running' | 'canceled' | 'completed' | 'failed';
  returnEmail: string;
}
