import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'movie' })
export class MovieEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'timestamptz', name: 'releaseyear' })
  releaseYear: Date;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'varchar' })
  genre: string;

  @Column({ type: 'numeric', name: 'imdbrating' })
  imdbRating: number;

  @Column({ type: 'varchar' })
  director: string;

  @Column({ type: 'varchar' })
  writers: string;
}
