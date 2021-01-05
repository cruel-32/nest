import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'statistics' })
export class Statistic {
  @PrimaryColumn() id: string;
  @Column({ type: 'text' }) puduMileages: string;
  @Column({ type: 'text' }) puduCounts: string;
  @CreateDateColumn({
    precision: null,
  })
  createdAt: Date;
  @UpdateDateColumn({
    precision: null,
  })
  updatedAt: Date;
}
