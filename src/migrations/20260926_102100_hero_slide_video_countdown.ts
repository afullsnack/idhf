import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "hero_slides" ADD COLUMN "video_id" integer;
   ALTER TABLE "hero_slides" ADD COLUMN "countdown_date" timestamp(3) with time zone;
   ALTER TABLE "hero_slides" ADD COLUMN "countdown_label" varchar;
   ALTER TABLE "_hero_slides_v" ADD COLUMN "version_video_id" integer;
   ALTER TABLE "_hero_slides_v" ADD COLUMN "version_countdown_date" timestamp(3) with time zone;
   ALTER TABLE "_hero_slides_v" ADD COLUMN "version_countdown_label" varchar;
   ALTER TABLE "hero_slides" ADD CONSTRAINT "hero_slides_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "_hero_slides_v" ADD CONSTRAINT "_hero_slides_v_version_video_id_media_id_fk" FOREIGN KEY ("version_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   CREATE INDEX "hero_slides_video_idx" ON "hero_slides" USING btree ("video_id");
   CREATE INDEX "_hero_slides_v_version_version_video_idx" ON "_hero_slides_v" USING btree ("version_video_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "hero_slides" DROP CONSTRAINT "hero_slides_video_id_media_id_fk";

   ALTER TABLE "_hero_slides_v" DROP CONSTRAINT "_hero_slides_v_version_video_id_media_id_fk";

   DROP INDEX "hero_slides_video_idx";
   DROP INDEX "_hero_slides_v_version_version_video_idx";
   ALTER TABLE "hero_slides" DROP COLUMN "video_id";
   ALTER TABLE "hero_slides" DROP COLUMN "countdown_date";
   ALTER TABLE "hero_slides" DROP COLUMN "countdown_label";
   ALTER TABLE "_hero_slides_v" DROP COLUMN "version_video_id";
   ALTER TABLE "_hero_slides_v" DROP COLUMN "version_countdown_date";
   ALTER TABLE "_hero_slides_v" DROP COLUMN "version_countdown_label";`)
}
