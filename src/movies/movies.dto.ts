import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class Movies {
  @IsUUID()
  @IsOptional()
  id: string;

  @IsString()
  @MinLength(3)
  @MaxLength(256)
  @ApiProperty()
  title: string;

  @IsDateString()
  @ApiProperty()
  releaseYear: Date;

  @IsString()
  @MinLength(3)
  @MaxLength(256)
  @ApiProperty()
  description: string;

  @IsString()
  @MinLength(3)
  @MaxLength(256)
  @ApiProperty()
  genre: string;

  @IsNumber()
  @ApiProperty()
  imdbRating: number;

  @IsString()
  @MinLength(3)
  @MaxLength(256)
  @ApiProperty()
  director: string;

  @IsString()
  @MinLength(3)
  @MaxLength(512)
  @ApiProperty()
  writers: string;
}

export interface GetAllParameters {
  title: string;
  genre: string;
}

export class MovieRouteParameter {
  @IsUUID()
  @ApiProperty()
  id: string;
}
