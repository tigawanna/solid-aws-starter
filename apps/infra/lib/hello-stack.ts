import path from "node:path";
import { fileURLToPath } from "node:url";
import { Stack, type StackProps } from "aws-cdk-lib";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

const here = path.dirname(fileURLToPath(import.meta.url));
const packages = path.join(here, "../../../packages");

export class HelloStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new NodejsFunction(this, "Hello", {
      functionName: "hello",
      runtime: Runtime.NODEJS_22_X,
      entry: path.join(packages, "hello/src/index.ts"),
    });

    new NodejsFunction(this, "Greet", {
      functionName: "greet",
      runtime: Runtime.NODEJS_22_X,
      entry: path.join(packages, "greet/src/index.ts"),
    });
  }
}
