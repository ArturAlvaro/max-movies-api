import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthResponseDto, AuthDto } from './auth.dto';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { authSwagger } from './swagger/auth.swagger';
import { badRequestSwagger } from 'helpers/badRequest.swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Autenticação do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário autenticado', type: authSwagger })
  @ApiResponse({ status: 401, description: 'Dados incorretos', type: badRequestSwagger })
  async signIn(@Body() authDto: AuthDto): Promise<AuthResponseDto> {
    return await this.authService.signIn(authDto.username, authDto.password);
  }
}
