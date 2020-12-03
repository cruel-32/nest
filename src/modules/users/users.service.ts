import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  // private readonly users: User[] = [
  //   {
  //     id: 1,
  //     name: 'name1',
  //     email: 'acdc1318@gmail.com',
  //     password: '$2b$10$wW9UvdSNOmuC/24A7ExPBegBtVUtFMUZBRk8v9u91Fccc5cI90ZEu',
  //     role: 'GUEST',
  //     createdDate: new Date(),
  //     updatedDate: new Date(),
  //   },
  // ];

  findOne(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: { email },
    });
  }
}
