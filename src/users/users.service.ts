import { Injectable } from '@nestjs/common';
import { UserDto } from './users.dto';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly users: UserDto[] = [];

  async create(newUser: UserDto) {
    newUser.id = uuid();
    newUser.password = await bcrypt.hash(newUser.password, 10);
    this.users.push(newUser);
    return newUser;
  }

  findByUserName(username: string): UserDto | null {
    return this.users.find((user) => user.username === username);
  }
}
