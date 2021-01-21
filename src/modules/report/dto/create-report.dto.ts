export class CreateReportDto {
  startDate: string;
  endDate: string;
  statistics: 'byDay' | 'weekly';
  shopIds: number[];
}
