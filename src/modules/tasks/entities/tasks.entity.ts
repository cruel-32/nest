import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tasks' })
export class Tasks {
  @PrimaryColumn() id: string;
  @Column() progress: string;
  @Column() returnEmail: string;
  @Column() runningTime: number;
  @Column() transactionTime: number;
  @Column({ type: 'text' }) message: string;
  @CreateDateColumn({
    precision: null,
  })
  createdAt: Date;
  @UpdateDateColumn({
    precision: null,
  })
  updatedAt: Date;
}
