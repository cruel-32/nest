import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'pudu_delivery_log' })
export class DeliveryLog {
  @PrimaryColumn() id: number;
  @Column({ nullable: true, type: 'double' }) average: number;
  @Column({ nullable: true }) battery: number;
  @Column({ nullable: true, type: 'double' }) mileage: number;
  @Column({ nullable: true, type: 'bigint' }) task_id: number;
  @Column({ nullable: true }) theme: string;
  @Column({ nullable: true }) total_time: number;
  @Column({ nullable: true }) hardver: string;
  @Column({ nullable: true }) mac: string;
  @Column({ nullable: true }) report_number: number;
  @Column({ nullable: true }) robot: number;
  @Column({ nullable: true }) softver: string;
  @Column({ nullable: true, type: 'bigint' }) timestamp: number;
  @Column({ nullable: true }) type: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
