import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'pudu_robot' })
export class Robot {
  @PrimaryColumn() id: number;
  @Column({ nullable: true }) mac: string;
  @Column({ nullable: true }) shop_id: number;
  @Column({ nullable: true }) pid: string;
  @Column({ nullable: true }) name: string;
  @Column({ nullable: true }) use_scene: number;
  @Column({ nullable: true }) product_code: string;
  @Column({ nullable: true }) use_type: number;
  @Column({ nullable: true }) group_id: string;
  @Column({ nullable: true }) use_end_time: string;
  @Column({ nullable: true }) softver: string;
  @Column({ nullable: true }) hardver: string;
  @Column({ nullable: true }) frozen_time: string;
  @Column({ nullable: true }) run_status_time: string;
  @Column({ nullable: true }) shop_name: string;
  @Column({ nullable: true }) group_name: string;
  @CreateDateColumn({
    precision: null,
  })
  createdAt: Date;
  @UpdateDateColumn({
    precision: null,
  })
  updatedAt: Date;
}
