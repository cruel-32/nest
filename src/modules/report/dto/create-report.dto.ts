import { Matches, IsNumber } from 'class-validator';

export class CreateReportDto {
  @Matches(/[0-9]{4}\-[0-9]{2}\-[0-9]{2}/) startDate: string;
  @Matches(/[0-9]{4}\-[0-9]{2}\-[0-9]{2}/) endDate: string;
  @IsNumber({}, { each: true }) shopIds: number[];
}
