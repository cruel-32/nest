export class CreateScheduleDto {
  date: string;
  endDate: string;
  scheduleTime: Date;
  progress: 'waiting' | 'running' | 'canceled' | 'completed' | 'failed';
  returnEmail: string;
}
