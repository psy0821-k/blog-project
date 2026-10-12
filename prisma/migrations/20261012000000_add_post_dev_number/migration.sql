-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "devNumber" INTEGER;

-- 이미 발행된 DEV_LOG 글에 작성일 순서로 번호를 채운다. 임시저장 글은 null로 둔다.
UPDATE "Post"
SET "devNumber" = ranked."devNumber"
FROM (
  SELECT "id", ROW_NUMBER() OVER (ORDER BY "createdAt" ASC, "id" ASC) AS "devNumber"
  FROM "Post"
  WHERE "type" = 'DEV_LOG' AND "published" = true
) AS ranked
WHERE "Post"."id" = ranked."id";

-- CreateIndex
CREATE UNIQUE INDEX "Post_type_devNumber_key" ON "Post"("type", "devNumber");
