import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'pudu_delivery_log' })
export class DeliveryLog {
  @PrimaryGeneratedColumn() id: number;
  @Column() average: number;
  @Column() battery: number;
  @Column() mileage: number;
  @Column() task_id: number;
  @Column() theme: string;
  @Column() total_time: number;
  @Column() hardver: string;
  @Column() mac: string;
  @Column() report_number: number;
  @Column() robot: number;
  @Column() softver: string;
  @Column() timestamp: number;
  @Column() type: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
