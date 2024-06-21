import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { UserDto } from './users.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../db/entities/user.entity';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async create(newUser: UserDto) {
    const checkUser = await this.cacheManager.get<string>(`username:${newUser.username}`);

    if (checkUser) {
      return JSON.parse(checkUser as string);
    }

    const checkUserDB = await this.findByUserName(newUser.username);

    if (checkUserDB) {
      throw new ConflictException(`Usuário ${newUser.username} já está cadastrado!`);
    }

    const dbUser = new UserEntity();
    dbUser.username = newUser.username;
    dbUser.password = await bcrypt.hash(newUser.password, 10);
    dbUser.active = true;

    const { username, id } = await this.usersRepository.save(dbUser);
    await this.cacheManager.set(`username:${newUser.username}`, JSON.stringify({ id, username }));

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
