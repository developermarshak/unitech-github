import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateReposTable1754574703455 implements MigrationInterface {
  name = "CreateReposTable1754574703455";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "repository" ("id" character varying NOT NULL, "userId" character varying NOT NULL, "projectPath" character varying NOT NULL, "stars" integer, "forks" integer, "issues" integer, "notExist" boolean, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b842c26651c6fc0b9ccd1c530e2" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "repository"`);
  }
}
