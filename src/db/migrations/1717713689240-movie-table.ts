import { MigrationInterface, QueryRunner } from 'typeorm';

export class MovieTable1717713689240 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    await queryRunner.query(`
    CREATE TABLE movie (
        id uuid NOT NULL DEFAULT uuid_generate_v4(),
        title varchar(256) NOT NULL,
        description varchar(256) NOT NULL,
        genre varchar(256) NOT NULL,
        director varchar(256) NOT NULL,
        writers varchar(512) NOT NULL,
        releaseYear timestamptz NOT NULL,
        imdbRating NUMERIC(3,1) NOT NULL,
        CONSTRAINT movie_pk PRIMARY KEY (id)
    );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS movie;`);
  }
}
