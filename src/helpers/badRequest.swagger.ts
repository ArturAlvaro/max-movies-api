import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class badRequestSwagger {
  @ApiProperty()
  message: string;

  @ApiPropertyOptional()
  error?: string;

  @ApiProperty()
  statusCode: number;
}
