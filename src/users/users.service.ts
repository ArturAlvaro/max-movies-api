import { ConflictException, Injectable } from '@nestjs/common';
import { UserDto } from './users.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/db/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>
  ) {}

  async create(newUser: UserDto) {
    const checkUser = await this.findByUserName(newUser.username);

    if (checkUser) {
      throw new ConflictException(`Usuário ${newUser.username} já está cadastrado!`);
    }

    const dbUser = new UserEntity();
    dbUser.username = newUser.username;
    dbUser.password = await bcrypt.hash(newUser.password, 10);
    dbUser.active = true;

    const { username, id } = await this.usersRepository.save(dbUser);

    return { id, username };
  }

  async findByUserName(username: string): Promise<UserDto | null> {
    const foundUser = await this.usersRepository.findOne({
      where: { username },
    });

    if (!foundUser) return null;

    return {
      id: foundUser.id,
      username: foundUser.username,
      password: foundUser.password,
      active: foundUser.active,
    };
  }
}
