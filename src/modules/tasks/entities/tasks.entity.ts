import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'Tasks' })
export class Tasks {
  @PrimaryGeneratedColumn() id: number;
  @Column() date: string;
  @Column() endDate: string;
  @Column() TasksTime: Date;
  @Column() progress: string;
  @Column() returnEmail: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
