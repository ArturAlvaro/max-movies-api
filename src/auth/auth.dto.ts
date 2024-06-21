import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AuthResponseDto {
  token: string;
  expiresIn: number;
}

export class AuthDto {
  @IsString()
  @ApiProperty()
  username: string;

  @IsString()
  @ApiProperty()
  password: string;
}
