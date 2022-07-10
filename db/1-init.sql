CREATE TABLE "url" (
    "id" SERIAL PRIMARY KEY,
    "hashOfUrl" character varying NOT NULL,
    "longUrl" character varying NOT NULL
);
CREATE UNIQUE INDEX "url_short_url_index" ON "url" ("hashOfUrl");

CREATE SEQUENCE IF NOT EXISTS "url_seq" START 1000;


