import { Matches, IsNumber, IsDataURI } from 'class-validator';

export class CreateReportDto {
  @Matches(/[0-9]{4}\-[0-9]{2}\-[0-9]{2}/) startDate: string;
  @Matches(/[0-9]{4}\-[0-9]{2}\-[0-9]{2}/) endDate: string;
  @Matches(/byDay|weekly/) statistics: 'byDay' | 'weekly';
  @IsNumber({}, { each: true }) shopIds: string[];
  @Matches(/[0-9]{8}\_[0-9]{6}/) path: string;
}

// export class CreateReportDto {
//   dataUri: string[];
//   startDate: string;
//   endDate: string;
//   statistics: 'byDay' | 'weekly';
//   shopIds: string[];
// }
