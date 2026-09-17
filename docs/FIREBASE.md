# Firebase deployment

Public app: https://plottwist-shi1720.web.app

Firebase Hosting serves the static assets. Other requests reach the existing Vinext App Router implementation on Cloud Run (`plottwist`, `us-central1`). This preserves server-rendered character pages, intentional 404s, metadata, and the public `/api/score` and `/api/health` contracts. Answers still score entirely in the browser during ordinary play; no database or external model service was introduced.

## Deploy

Use Node 22 and authenticated Google Cloud/Firebase CLIs. The existing Cloudflare build remains available through `npm run build`.

```sh
npm ci
npm run check
npm run build:firebase
# Run locally, then run browser tests in another terminal:
PORT=3211 npm run start:firebase
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3211 npm run test:e2e

gcloud builds submit --project gen-lang-client-0444960702 --region us-central1 --config cloudbuild.firebase.yaml
gcloud run deploy plottwist \
  --image us-central1-docker.pkg.dev/gen-lang-client-0444960702/cloud-run-source-deploy/plottwist:firebase \
  --project gen-lang-client-0444960702 --region us-central1 \
  --service-account plottwist-runtime@gen-lang-client-0444960702.iam.gserviceaccount.com \
  --allow-unauthenticated --max-instances 2 --memory 512Mi --cpu 1 --timeout 30
npx firebase-tools@15.30.1 deploy --only hosting --project gen-lang-client-0444960702
```

The runtime service account has no additional project roles. Cloud Run scales to zero. The container uses an unprivileged OS user. Hosting and the original middleware retain frame, MIME, permissions, and referrer protections.

## Verification and migration notes

- Type checking, lint, unit tests with coverage, and all 38 desktop/mobile browser journeys pass against the native Node production build.
- Browser checks cover complete question packs, local saved answers, revision, multi-tab isolation, character pages, portraits, clipboard sharing, and intentional errors.
- Browser local storage is origin-scoped. An old-domain saved quiz does not automatically appear on the new domain; existing portable result query parameters remain supported when opened at the new origin.
- Both `plottwist` and `plot-twist` hosting site IDs were already allocated elsewhere, so the public site uses the account suffix.
