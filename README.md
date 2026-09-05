<div align="center">

# Plot Twist ✳

### Your life. But make it a sitcom.

A personality sitcom for people who bring a spreadsheet to brunch—or cause the spreadsheet to exist.

[Play Plot Twist](https://plottwist.sg127977958.chatgpt.site) · [Meet the cast](https://plottwist.sg127977958.chatgpt.site/cast) · [Architecture](docs/ARCHITECTURE.md) · [Engineering evaluations](evaluation/README.md)

[![Quality](https://github.com/shi1720/plottwist/actions/workflows/ci.yml/badge.svg)](https://github.com/shi1720/plottwist/actions/workflows/ci.yml)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6)
![License](https://img.shields.io/badge/license-MIT-24231f)

<img src="public/characters/0000.webp" alt="Cozy Enigma, the lavender mug" width="175" />
<img src="public/characters/0101.webp" alt="Rabbit Hole Resident" width="175" />
<img src="public/characters/0110.webp" alt="Spreadsheet Sage, the calculator" width="175" />
<img src="public/characters/1001.webp" alt="Lovable Menace, the orange imp" width="175" />

</div>

## The pitch

The internet has enough ways to rank you. **Plot Twist turns everyday dilemmas into an original sitcom character**, then gives you the receipts. Play a three-minute episode, meet your alter ego, save a character card, and mix two characters to discover your fictional sitcom dynamic.

Warm comedy instead of a judgment score. Explainable rules instead of an opaque personality label. No signup, AI API bill, advertising tracker, or required database.

**This is entertainment, not MBTI, an official 16Personalities product, psychometrics, or relationship advice.** All character names and scenes are original.

## What actually works

- **Three complete episodes:** The Pilot Episode, Out of Office, and The Group Chat. 36 original scenes, 144 choices.
- **16 uniquely illustrated, reachable archetypes:** individual silhouettes, props, character scenes and portraits used consistently throughout the app. Every character is attainable in every episode.
- **A sitcom that talks back:** three acts per episode and 144 choice-specific comedy reactions, plus a fictional cold open for each result.
- **Explainable results:** four tendencies, a character brief, affectionate roast, strength, growth prompt, and local answer receipts.
- **Reliable play:** keyboard-accessible choices, previous/next navigation, answer revision, per-episode resume, restart, corrupt-storage recovery, and cross-tab clear-data handling.
- **Privacy-conscious sharing:** versioned links carry four coarse tendencies, never an answer history. Strong values are capped before sharing so an extreme score does not reveal all three underlying answers.
- **Browser-generated PNG cards:** no rendering service, image upload, or external processing.
- **Cast chemistry:** all 256 ordered pairings produce symmetric fictional dynamics; no fake compatibility percentage.
- **Responsive UI:** desktop and mobile layouts, reduced-motion support, screen-reader labels, and accessibility scans.
- **Stateless reference API:** bounded, validated `POST /api/score` and `GET /api/health`.
- **Engineering evaluation lab:** three Python tasks, broken baselines, acceptance tests, source hashes, golden implementations, patches, clean execution, and deterministic work budgets.

## Run locally

Requirements: Node **22.13+**, npm, Python **3.9+**. No credentials or paid services required for local play.

```bash
git clone https://github.com/shi1720/plottwist.git
cd plottwist
npm ci
npm run dev
```

Open the Local URL printed by the server (normally `http://localhost:3000`). Answers remain in that browser. Internet is needed to install dependencies; quiz gameplay itself uses no external API. This is not an offline-installed PWA.

```bash
npm run check           # strict types, lint, unit/property/API/differential tests + coverage
npm run eval:verify     # each baseline must fail; each golden solution must pass
npm run benchmark       # warm local scorer timings, explicitly not an SLA
npm run build           # production Cloudflare Worker + public assets
npm run start           # serve the production artifact locally
```

Browser tests:

```bash
npx playwright install chromium
npm run test:e2e
# Or test a running production build:
PLAYWRIGHT_BASE_URL=http://localhost:3001 npm run test:e2e
```

The browser suite has desktop and mobile Chromium projects. CI runs it against the **production Worker**, not only the development server.

## Why this is more than a quiz skin

The application deliberately keeps its scoring algorithm small. The engineering depth lives in **contracts, failure behavior, privacy, reproducibility, and verification**:

| Concern                  | Implementation                                                           | Evidence                                                |
| ------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------- |
| Correct scoring          | Pure TypeScript core; canonical IDs; runtime validation                  | Seeded property tests; all 16 archetypes reachable      |
| Independent verification | Python reference implementation                                          | 300 complete/partial cross-language fixtures            |
| User revisions           | Answers are source of truth; scores are recomputed                       | Browser edit/reload trace and regression tests          |
| Untrusted input          | Strict link grammar, storage parser, 8 KiB streamed body bound           | Malformed, oversized, duplicate, foreign, sparse inputs |
| Privacy                  | Local play, coarse aggregate sharing, cross-tab deletion                 | Extreme-score regression and two-tab browser test       |
| Performance              | Linear catalog indexing, 22–35 KB individual WebPs, lazy card generation | Operation-count evaluation; reproducible microbenchmark |
| Reproducible repair      | Hashed task fixtures and clean candidate execution                       | Failing baseline → passing golden solution              |

See [validation evidence](docs/VALIDATION.md) for actual results and boundaries, [the role-focused walkthrough](docs/PORTFOLIO.md), [the design-judge rubric](docs/DESIGN_REVIEW.md), and [the review log](docs/REVIEW.md) for issues found and fixed during independent review.

## Repository map

```text
app/                    Routes, metadata, error states, bounded API
components/plot/        Quiz, result, cast, chemistry, privacy UI
components/ui/          Scaffolded accessible primitives (vendored)
lib/content/            Original scenes and 16 characters
lib/engine/             Pure scoring, sharing, storage, chemistry, card export
tests/                  Unit, property, API, Python differential, browser tests
evaluation/             Independent oracle + reproducible engineering challenges
scripts/                Reproducible benchmark
docs/                   Architecture, decisions, operations, evidence, pitch
.github/                CI, dependency updates, issue and PR templates
```

## Deployment and limits

The app produces a Cloudflare-compatible Worker with static assets. [Deployment instructions](docs/DEPLOYMENT.md) cover hosted publishing, local production smoke tests, rollback, and health checks. `.openai/hosting.json` identifies this instance; a fork must register its own Site or use its own Cloudflare configuration.

No database, login, multiplayer room, analytics pipeline, or external AI is pretending to exist. Sharing is public to anyone with the link, not encrypted or revocable. Browser storage can be cleared by the user or browser. Ordinary hosting request logs may include URLs. The optional local evaluation runner executes **trusted Python code, not sandboxed submissions**.

Vinext is currently a beta framework dependency. This repository is a tested deployable release, not a claim of long-running production scale, scientific validation, or an operational SLA.

## Contributing and credits

Read [CONTRIBUTING.md](CONTRIBUTING.md) before changing scoring or content versions. Report sensitive findings using [SECURITY.md](SECURITY.md).

Created by **Shivam Gupta**, with AI-assisted implementation, independent agent review, and original AI-generated character art. The development process and limitations are documented rather than presented as years of production history.

MIT licensed. Third-party dependencies retain their own licenses. Generated artwork has no third-party stock attribution requirement; applicable rights in the supplied artwork are offered under the repository license without a claim of exclusivity.
