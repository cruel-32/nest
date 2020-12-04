import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tasks' })
export class Tasks {
  @PrimaryGeneratedColumn() id: number;
  @Column() date: string;
  @Column() taskTime: Date;
  @Column() progress: string;
  @Column() returnEmail: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
