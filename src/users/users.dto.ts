import { IsEmail, IsString } from 'class-validator';

export class UserDto {
  id: string;

  @IsString()
  @IsEmail()
  username: string;

  @IsString()
  password: string;

  active: boolean;
}
