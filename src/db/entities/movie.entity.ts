import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'movie' })
export class MovieEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column({ type: 'varchar' })
  @ApiProperty()
  title: string;

  @Column({ type: 'timestamptz', name: 'releaseyear' })
  @ApiProperty()
  releaseYear: Date;

  @Column({ type: 'varchar' })
  @ApiProperty()
  description: string;

  @Column({ type: 'varchar' })
  @ApiProperty()
  genre: string;

  @Column({ type: 'numeric', name: 'imdbrating' })
  @ApiProperty()
  imdbRating: number;

  @Column({ type: 'varchar' })
  @ApiProperty()
  director: string;

  @Column({ type: 'varchar' })
  @ApiProperty()
  writers: string;
}
