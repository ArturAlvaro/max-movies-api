import { ApiProperty } from '@nestjs/swagger';

export class createUserSwagger {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;
}
