import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './users.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { createUserSwagger } from './swagger/create-user.swagger';
import { badRequestSwagger } from '../helpers/badRequest.swagger';

@Controller('users')
@ApiTags('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiOperation({ summary: 'Cria um usuário ' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso', type: createUserSwagger })
  @ApiResponse({ status: 409, description: 'Usuário já cadastrado', type: badRequestSwagger })
  @Post('create')
  create(@Body() user: UserDto) {
    return this.userService.create(user);
  }
}
