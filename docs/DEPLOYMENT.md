# Deployment and operation

## Reproducible release

```bash
npm ci
npm run check
npm run eval:verify
npm audit --audit-level=moderate
npm run build
npm run start -- --port 3001
```

In another terminal:

```bash
curl --fail http://localhost:3001/api/health
PLAYWRIGHT_BASE_URL=http://localhost:3001 npm run test:e2e
```

The build emits `dist/server/index.js`, Worker configuration, and browser assets under `dist/client`. The Worker entry exports a fetch handler. Do not deploy the source directory as if it were static output: dynamic API and character routes need the Worker.

## Sites deployment

This instance uses Sites with `.openai/hosting.json`. The release flow pushes the exact source commit to the provisioned source repository, packages the built artifact with hosting metadata, saves that version, and deploys the saved version. Credentials remain command-scoped and are never stored in repository files or remote URLs.

A fork must register its own Site and replace the instance project ID. Do not publish into this project's ID. No runtime secrets, D1 database, R2 bucket, or identity provider are needed by the application.

## Independent Cloudflare deployment

For your own Cloudflare account, use the generated Worker configuration as a starting point, set your own Worker name/account and asset paths, and deploy with Wrangler after authenticating to that account. Remove instance-specific Sites hosting integration if moving away from Sites. The production smoke tests and API health check remain applicable. This path is documented for portability; the release evidence identifies the deployment path actually tested.

## Runtime checks

- `GET /api/health` must return HTTP 200 and `{status:"ok", app:"plottwist", version:"1.0.0", engine:"v1"}`.
- Open a fresh quiz, answer one scene, reload, and verify resume.
- Open a shared result in a clean browser: character/tendencies work without local receipts.
- Check the cast mixer, unknown route, and invalid result error screen.
- Investigate non-2xx responses through platform logs. Avoid collecting raw answers in logs.

No analytics SDK is installed. No request-body logs are written by the app. Infrastructure may log IPs, paths, and shared query strings under its own policy. If adding telemetry, document collection and minimize data first.

## Rollback

Redeploy the previous known-good saved artifact. Keep v1 content and decoding semantics stable: old browser storage and links may outlive any deployment. There is no database migration to roll back. Changes to IDs, weights, axis order, or character mapping require a new compatibility namespace and explicit handling of prior versions.

## Capacity and operational limits

Scoring is local for ordinary visitors. The optional API processes at most 8 KiB and 12 answers; computation is bounded by the fixed catalog. Cloudflare's runtime limits still apply. Rate limits, abuse controls, availability alerts, and a service-level objective are platform/operational work—not implied by a successful deployment.

Vinext is beta. Keep React's server/client packages in lockstep, upgrade matching RSC/Vite/Cloudflare peers together, and rerun production-browser tests after upgrades. Avoid exposing development servers to the public internet.

## Live release

Public application: https://plottwist.sg127977958.chatgpt.site

The hosting service returned this final canonical address at deployment. Use the deployed address rather than the initial registration preview URL.
