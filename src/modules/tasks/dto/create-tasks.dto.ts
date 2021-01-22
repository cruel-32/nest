import { IsEmail, Matches } from 'class-validator';

export class CreateTasksDto {
  @Matches(/[0-9]{4}\-[0-9]{2}\-[0-9]{2}/, {
    message: 'Please input a Date Format. (YYYY-MM-DD)',
  })
  id: string;
  @Matches(/waiting|running|canceled|completed|failed/)
  progress: 'waiting' | 'canceled' | 'completed' | 'failed';
  @IsEmail() returnEmail: string;
  runningTime: number;
  transactionTime: number;
  message: string;
}
