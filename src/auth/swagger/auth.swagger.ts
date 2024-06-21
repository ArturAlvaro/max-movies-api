import { ApiProperty } from '@nestjs/swagger';

export class authSwagger {
  @ApiProperty()
  token: string;

  @ApiProperty()
  expiresIn: string;
}
