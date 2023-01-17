import { MigrationInterface, QueryRunner } from "typeorm";

export class myMigration1673944710450 implements MigrationInterface {
    name = 'myMigration1673944710450'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "groups" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "permissions" text array NOT NULL, CONSTRAINT "PK_659d1483316afb28afd3a90646e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_group" ("groupsId" uuid NOT NULL, "usersId" uuid NOT NULL, CONSTRAINT "PK_00756261d4bfd571181875bb106" PRIMARY KEY ("groupsId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_62866f0c69d2a8340e6777a3ad" ON "user_group" ("groupsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_3d29fcc8b18122140372b7c101" ON "user_group" ("usersId") `);
        await queryRunner.query(`ALTER TABLE "user_group" ADD CONSTRAINT "FK_62866f0c69d2a8340e6777a3ade" FOREIGN KEY ("groupsId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_group" ADD CONSTRAINT "FK_3d29fcc8b18122140372b7c1019" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_group" DROP CONSTRAINT "FK_3d29fcc8b18122140372b7c1019"`);
        await queryRunner.query(`ALTER TABLE "user_group" DROP CONSTRAINT "FK_62866f0c69d2a8340e6777a3ade"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3d29fcc8b18122140372b7c101"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_62866f0c69d2a8340e6777a3ad"`);
        await queryRunner.query(`DROP TABLE "user_group"`);
        await queryRunner.query(`DROP TABLE "groups"`);
    }

}
