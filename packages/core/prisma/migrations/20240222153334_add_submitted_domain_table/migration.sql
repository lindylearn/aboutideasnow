-- CreateTable
CREATE TABLE "SubmittedDomain" (
    "domain" TEXT NOT NULL,
    "email" TEXT,
    "success" BOOLEAN NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubmittedDomain_pkey" PRIMARY KEY ("domain")
);
