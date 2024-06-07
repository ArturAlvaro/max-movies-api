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
  title: string;

  @IsDateString()
  releaseYear: Date;

  @IsString()
  @MinLength(3)
  @MaxLength(256)
  description: string;

  @IsString()
  @MinLength(3)
  @MaxLength(256)
  genre: string;

  @IsNumber()
  imdbRating: number;

  @IsString()
  @MinLength(3)
  @MaxLength(256)
  director: string;

  @IsString()
  @MinLength(3)
  @MaxLength(512)
  writers: string;
}

export interface GetAllParameters {
  title: string;
  genre: string;
}

export class MovieRouteParameter {
  @IsUUID()
  id: string;
}
