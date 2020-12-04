import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'pudu_delivery_detail' })
export class DeliveryDetail {
  @PrimaryGeneratedColumn() id: number;
  @Column() deliveryId: number;
  @Column() average: string;
  @Column() duration: number;
  @Column() duration_pause: number;
  @Column() duration_wait: number;
  @Column() goal_id: string;
  @Column() mileage: string;
  @Column() order_id: number;
  @Column() status: number;
  @Column() task_type: number;
  @CreateDateColumn() createdAt: string;
  @UpdateDateColumn() updatedAt: string;
}
