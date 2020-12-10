import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'pudu_delivery_detail' })
export class DeliveryDetail {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true }) deliveryId: number;
  @Column({ nullable: true, type: 'double' }) average: string;
  @Column({ nullable: true }) duration: number;
  @Column({ nullable: true }) duration_pause: number;
  @Column({ nullable: true }) duration_wait: number;
  @Column({ nullable: true }) goal_id: string;
  @Column({ nullable: true, type: 'double' }) mileage: string;
  @Column({ nullable: true, type: 'bigint' }) order_id: number;
  @Column({ nullable: true, type: 'tinyint' }) status: number;
  @Column({ nullable: true }) task_type: number;
  @CreateDateColumn() createdAt: string;
  @UpdateDateColumn() updatedAt: string;
}
