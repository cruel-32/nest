import { Injectable } from '@nestjs/common';

export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: number;
  updated_at: number;
};

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      id: 1,
      name: 'name1',
      email: 'acdc1318@gmail.com',
      password: 'changeme',
      created_at: Date.now(),
      updated_at: Date.now(),
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.name === username);
  }
}
