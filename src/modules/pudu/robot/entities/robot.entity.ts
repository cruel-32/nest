import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'pudu_robot' })
export class Robot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  mac: string;

  @Column()
  shop_id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
