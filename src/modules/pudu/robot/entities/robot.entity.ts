import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'pudu_robot' })
export class Robot {
  @PrimaryGeneratedColumn() id: number;
  @Column() mac: string;
  @Column() shop_id: number;
  @Column() pid: string;
  @Column() name: string;
  @Column() use_scene: number;
  @Column() product_code: string;
  @Column() use_type: number;
  @Column() group_id: string;
  @Column() use_end_time: string;
  @Column() softver: string;
  @Column() hardver: string;
  @Column() frozen_time: string;
  @Column() run_status_time: string;
  @Column() shop_name: string;
  @Column() group_name: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
