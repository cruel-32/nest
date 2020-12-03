import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users', schema: 'board' })
export class User {
  @PrimaryGeneratedColumn({
    name: 'user_id',
  })
  id: number;

  @Column({ length: 20 })
  name: string;

  @Column({ length: 100 })
  email: string;

  @Column({ length: 20 })
  role: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdDate: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedDate: Date;
}
