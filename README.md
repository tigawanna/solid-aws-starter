# processor-aws

pnpm workspace for the hello and greet Lambdas, plus a Solid 2 frontend.

```text
apps/infra          CDK app (cdklocal deploy)
apps/web            Solid 2.0 RC (solid-js 2.0.0-rc.18)
packages/hello      hello handler
packages/greet      greet handler
```

## Frontend

```bash
pnpm install
pnpm dev
```

Opens on http://localhost:3000. Calls go through the Vite proxy to `http://localhost:4566`.

## Lambdas

Floci has to be running (`floci start`).

```bash
export AWS_ACCESS_KEY_ID=test AWS_SECRET_ACCESS_KEY=test AWS_DEFAULT_REGION=us-east-1
export AWS_ENDPOINT_URL=http://localhost:4566
export AWS_ENDPOINT_URL_S3=http://s3.localhost.floci.io:4566
pnpm --filter infra exec cdklocal bootstrap
pnpm deploy
```
