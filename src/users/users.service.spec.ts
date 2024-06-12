import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from 'src/db/entities/user.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { v4 as uuid } from 'uuid';
import { ConflictException } from '@nestjs/common';

const userEntity: UserEntity = {
  id: uuid(),
  active: true,
  username: 'jhon.doe@email.com',
  password: 'teste123',
};

describe('UserService', () => {
  let userService: UsersService;
  let userRepositoryMock: Partial<Record<string, jest.Mock>>;
  let cacheManagerMock: Partial<Record<string, jest.Mock>>;

  beforeEach(async () => {
    cacheManagerMock = {
      get: jest.fn(),
      set: jest.fn(),
    };

    userRepositoryMock = {
      create: jest.fn().mockResolvedValue({ id: userEntity.id, username: userEntity.username }),
      findByUserName: jest.fn(),
      save: jest.fn().mockResolvedValue(userEntity),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: userRepositoryMock,
        },
        {
          provide: CACHE_MANAGER,
          useValue: cacheManagerMock,
        },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
  });

  it('Service está definido', () => {
    expect(userService).toBeDefined();
  });

  describe('Função create', () => {
    it('Retorna usuário criado com os campos "id" e "username"', async () => {
      // Arrange
      cacheManagerMock.get.mockResolvedValue(null);
      userRepositoryMock.findOne.mockResolvedValue(null);

      // Act
      const result = await userService.create(userEntity);

      // Assert
      expect(result).toEqual({ id: userEntity.id, username: userEntity.username });
      expect(cacheManagerMock.get).toHaveBeenCalledTimes(1);
      expect(cacheManagerMock.get).toHaveBeenCalledWith(`username:${userEntity.username}`);
      expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { username: userEntity.username },
      });
    });

    it('Testa usuário em cache', async () => {
      // Arrange
      cacheManagerMock.get.mockResolvedValue(
        JSON.stringify({ id: userEntity.id, username: userEntity.username })
      );

      // Act
      const result = await userService.create(userEntity);

      // Assert
      expect(result).toEqual({ id: userEntity.id, username: userEntity.username });
      expect(cacheManagerMock.get).toHaveBeenCalledWith(`username:${userEntity.username}`);
    });

    it('Testa criação de usuário que já está cadastrado', async () => {
      // Arrange
      userRepositoryMock.findOne.mockResolvedValue(userEntity);
      cacheManagerMock.get.mockResolvedValue(null);

      // Act & Assert
      await expect(userService.create(userEntity)).rejects.toThrow(
        new ConflictException(`Usuário ${userEntity.username} já está cadastrado!`)
      );
      expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { username: userEntity.username },
      });
    });
  });

  describe('Função findUserByName', () => {
    it('Retorna usuário encontrado', async () => {
      // Arrange
      userRepositoryMock.findOne.mockResolvedValue(userEntity);

      // Act
      const result = await userService.findByUserName(userEntity.username);

      // Assert
      expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { username: userEntity.username },
      });
      expect(result).toEqual({
        id: userEntity.id,
        username: userEntity.username,
        password: userEntity.password,
        active: userEntity.active,
      });
    });

    it('Retorna null para usuário não encontrado', async () => {
      // Arrange
      userRepositoryMock.findOne.mockResolvedValue(null);

      // Act
      const result = await userService.findByUserName('notValidUsername');

      // Assert
      expect(result).toBeNull();
      expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { username: 'notValidUsername' },
      });
    });
  });
});
