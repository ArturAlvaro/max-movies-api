import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserTable1717713703758 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "user" (
            id uuid NOT NULL DEFAULT uuid_generate_v4(),
            username varchar(256) NOT NULL,
            password varchar(256) NOT NULL,
            active BOOLEAN NOT NULL,
            CONSTRAINT user_pk PRIMARY KEY (id),
            CONSTRAINT user_un_username UNIQUE (username)
        );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS user;`);
  }
}
