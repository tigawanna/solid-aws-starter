#!/usr/bin/env node
import { App } from "aws-cdk-lib";
import { HelloStack } from "../lib/hello-stack.js";
import { MediaStack } from "../lib/media-stack.js";

const env = { account: "000000000000", region: "us-east-1" };

const app = new App();

new HelloStack(app, "Hello", { env });
new MediaStack(app, "Media", { env });
