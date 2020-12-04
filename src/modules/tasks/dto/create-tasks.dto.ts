import { IsString, IsDate, IsEmail, Matches } from 'class-validator';

export class CreateTasksDto {
  @IsString() date: string;
  // @IsDate() taskTime: Date;
  @Matches(/waiting|running|canceled|completed|failed/)
  progress: 'waiting' | 'running' | 'canceled' | 'completed' | 'failed';
  @IsEmail() returnEmail: string;
}
