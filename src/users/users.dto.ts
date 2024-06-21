import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class UserDto {
  id: string;

  @IsString()
  @IsEmail()
  @ApiProperty()
  username: string;

  @IsString()
  @ApiProperty()
  password: string;

  active: boolean;
}
