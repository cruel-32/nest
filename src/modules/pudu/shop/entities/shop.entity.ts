import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'pudu_shop' })
export class Shop {
  @PrimaryColumn() id: number;
  @Column({ nullable: true }) create_time: string;
  @Column({ nullable: true }) cuisine: string;
  @Column({ nullable: true }) grade: string;
  @Column({ nullable: true }) name: string;
  @Column({ nullable: true }) operation_status: number;
  @Column({ nullable: true }) robot_count: number;
  @Column({ nullable: true, type: 'simple-array' }) robot_use_type: string;
  @Column({ nullable: true }) shop_type: string;
  @Column({ nullable: true }) sn: string;
  @Column({ nullable: true }) sys_sn: string;

  @CreateDateColumn({
    precision: null,
  })
  createdAt: Date;
  @UpdateDateColumn({
    precision: null,
  })
  updatedAt: Date;
}
