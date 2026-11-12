import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import sharp from "sharp";
import { isThumbnailKey, thumbnailKey } from "./thumbnail-key.js";

const s3 = new S3Client({});
const THUMB_WIDTH = 320;

type ThumbnailJob = {
  key: string;
};

type SqsRecord = {
  messageId: string;
  body: string;
};

export type ThumbnailEvent = {
  Records: SqsRecord[];
};

// SQS event source: each Records[] item is one queue message
export async function handler(event: ThumbnailEvent) {
  const batchItemFailures: { itemIdentifier: string }[] = [];

  for (const record of event.Records) {
    try {
      await processRecord(record.body);
    } catch (error) {
      console.error("thumbnail failed", { messageId: record.messageId, error });
      // Report this id so only failed messages retry (2nd fail → DLQ)
      batchItemFailures.push({ itemIdentifier: record.messageId });
    }
  }

  return { batchItemFailures };
}

async function processRecord(body: string) {
  const job = JSON.parse(body) as ThumbnailJob;
  const sourceBucket = process.env.MAIN_BUCKET;
  const destBucket = process.env.THUMBNAIL_BUCKET;
  let missingEnvs = []
  if (!sourceBucket) missingEnvs.push("MAIN_BUCKET");
  if (!destBucket) missingEnvs.push("THUMBNAIL_BUCKET");
  if (!job.key) missingEnvs.push("message key");
  if (missingEnvs.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvs.join(", ")}`);
  }
  // for the types
  if (!sourceBucket || !destBucket || !job.key) {
    throw new Error("MAIN_BUCKET, THUMBNAIL_BUCKET, and message key are required");
  }
  if (isThumbnailKey(job.key)) return;
// get the original image
  const object = await s3.send(
    new GetObjectCommand({ Bucket: sourceBucket, Key: job.key }),
  );
  // transform the original image to a byte array for processing with sharp
  const bytes = await object.Body?.transformToByteArray();
  if (!bytes) throw new Error(`empty object: ${sourceBucket}/${job.key}`);

 
  const thumb = await sharp(bytes)
    .rotate()
    .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
    .toBuffer();

  // Same key with `-thumbnail`, written to thumbnailBucket
  await s3.send(
    new PutObjectCommand({
      Bucket: destBucket,
      Key: thumbnailKey(job.key),
      Body: thumb,
      ContentType: object.ContentType,
    }),
  );
}
