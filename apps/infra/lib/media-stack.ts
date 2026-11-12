import path from "node:path";
import { fileURLToPath } from "node:url";
import { Duration, Stack, type StackProps } from "aws-cdk-lib";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";

const here = path.dirname(fileURLToPath(import.meta.url));
const packages = path.join(here, "../../../packages");

export class MediaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const mainBucket = new Bucket(this, "MainBucket", {
      bucketName: "media-main",
    });

    const thumbnailBucket = new Bucket(this, "ThumbnailBucket", {
      bucketName: "media-thumbnails",
    });

    // 2 failed receives → park here, stop retrying
    const thumbnailWorkerDlq = new Queue(this, "ThumbnailWorkerDlq", {
      queueName: "thumbnail-worker-dlq",
      retentionPeriod: Duration.days(14),
    });

    // Worker inbox; visibilityTimeout > worker timeout
    const thumbnailWorkerQueue = new Queue(this, "ThumbnailWorkerQueue", {
      queueName: "thumbnail-worker",
      visibilityTimeout: Duration.seconds(90),
      deadLetterQueue: {
        queue: thumbnailWorkerDlq,
        maxReceiveCount: 2,
      },
    });

    const thumbnailWorker = new NodejsFunction(this, "ThumbnailWorker", {
      functionName: "thumbnail-worker",
      runtime: Runtime.NODEJS_22_X,
      entry: path.join(packages, "media/src/index.ts"),
      memorySize: 1024,
      timeout: Duration.seconds(30),
      environment: {
        MAIN_BUCKET: mainBucket.bucketName,
        THUMBNAIL_BUCKET: thumbnailBucket.bucketName,
      },
      bundling: {
        externalModules: ["@aws-sdk/*"],
        nodeModules: ["sharp"],
      },
    });

    // Lambda long-polls this queue; empty queue does not invoke
    thumbnailWorker.addEventSource(
      new SqsEventSource(thumbnailWorkerQueue, {
        batchSize: 5,
        reportBatchItemFailures: true,
      }),
    );

    mainBucket.grantRead(thumbnailWorker);
    thumbnailBucket.grantReadWrite(thumbnailWorker);
  }
}
