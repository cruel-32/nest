import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'pudu_delivery' })
export class Delivery {
  @PrimaryColumn() id: number;
  @Column({ nullable: true }) create_time: string;
  @Column({ nullable: true, type: 'bigint' }) timestamp: number;
  @Column({ nullable: true }) mac: string;
  @Column({ nullable: true, type: 'bigint' }) task_id: number;
  @Column({ nullable: true }) treaty: number;
  @Column({ nullable: true }) log_type: number;
  @Column({ nullable: true }) task_type: number;
  @Column({ nullable: true }) report_number: number;
  @Column({ nullable: true }) softver: string;
  @Column({ nullable: true }) hardver: string;
  @Column({ nullable: true }) product_code: string;
  @Column({ nullable: true }) table_count: number;
  @Column({ nullable: true }) tray_count: number;
  @Column({ nullable: true, type: 'double' }) mileage: number;
  @Column({ nullable: true, type: 'double' }) average: number;
  @Column({ nullable: true }) duration: number;
  @Column({ nullable: true }) duration_back: number;
  @Column({ nullable: true }) duration_delivery: number;
  @Column({ nullable: true }) duration_pause: number;
  @Column({ nullable: true }) duration_wait: number;
  @Column({ nullable: true }) interrupt: number;
  @Column({ nullable: true }) battery_end: number;
  @Column({ nullable: true }) task_finish: number;
  @Column({ nullable: true }) status: number;
  @Column({ nullable: true }) log: string;
  @Column({ nullable: true }) shop_id: number;
  @Column({ nullable: true }) shop_name: string;
  @Column() robot_id: number;
  @CreateDateColumn({
    precision: null,
  })
  createdAt: Date;
  @UpdateDateColumn({
    precision: null,
  })
  updatedAt: Date;
}
