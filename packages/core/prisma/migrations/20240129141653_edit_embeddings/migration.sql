alter table "Post"
alter COLUMN embedding TYPE vector(512);

CREATE INDEX "Post_content_search" ON "Post" USING GIN (to_tsvector('english', content));
