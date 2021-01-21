import { Entity, Column } from 'typeorm';

@Entity({ name: 'pudu_delivery' })
export class Report {
  @Column({ nullable: true }) startDate: string;
  @Column({ nullable: true }) endDate: string;
  @Column({ nullable: true }) statistics: string;
  @Column({ nullable: true, type: 'simple-array' }) shopIds: number[];
}
