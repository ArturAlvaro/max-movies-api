import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserEntity } from 'src/db/entities/user.entity';
import { v4 as uuid } from 'uuid';

const userEntity: UserEntity = {
  id: uuid(),
  active: true,
  username: 'jhon.doe@email.com',
  password: 'teste123',
};

describe('UserController', () => {
  let userController: UsersController;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest
              .fn()
              .mockResolvedValue({ id: userEntity.id, username: userEntity.username }),
            findByUserName: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = module.get<UsersController>(UsersController);
    userService = module.get<UsersService>(UsersService);
  });

  it('Testa rota de criação de usuário', () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
  });

  it('Retorna id e username', async () => {
    // act
    const result = await userController.create(userEntity);

    // assert
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('username');
    expect(result.username).toEqual(userEntity.username);
    expect(userService.create).toHaveBeenCalledTimes(1);
  });
});
