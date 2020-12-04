import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'pudu_delivery' })
export class Delivery {
  @PrimaryGeneratedColumn() id: number;
  @Column() create_time: string;
  @Column() timestamp: number;
  @Column() mac: string;
  @Column() task_id: number;
  @Column() treaty: number;
  @Column() log_type: number;
  @Column() task_type: number;
  @Column() report_number: number;
  @Column() softver: string;
  @Column() hardver: string;
  @Column() product_code: string;
  @Column() table_count: number;
  @Column() tray_count: number;
  @Column() mileage: number;
  @Column() average: number;
  @Column() duration: number;
  @Column() duration_back: number;
  @Column() duration_delivery: number;
  @Column() duration_pause: number;
  @Column() duration_wait: number;
  @Column() interrupt: number;
  @Column() battery_end: number;
  @Column() task_finish: number;
  @Column() status: number;
  @Column() log: string;
  @Column() robot_id: number;
  @Column() shop_id: number;
  @Column() shop_name: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
