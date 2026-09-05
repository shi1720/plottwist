# Release validation

Recorded on **2026-09-05** for the initial 1.0.0 release. These are executed checks, not projected targets.

| Check                                       | Observed result                                                                                                                  |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Strict TypeScript                           | Pass                                                                                                                             |
| Oxlint on owned code                        | Pass                                                                                                                             |
| Vitest unit/property/API/differential suite | **37 tests passed** across 4 files                                                                                               |
| Scoring/API coverage scope                  | **95.52% statements, 93.63% branches, 100% functions, 96.52% lines**                                                             |
| Production build                            | Cloudflare-compatible Worker and browser assets produced successfully                                                            |
| Playwright against production Worker        | **26 tests passed**, desktop and mobile Chromium                                                                                 |
| Automated accessibility                     | Home, quiz, result, cast, chemistry checked with WCAG 2 A/AA and 2.1 AA rules; no reported violations in those scans             |
| Evaluation tasks                            | **3 baselines fail; 3 golden solutions pass**                                                                                    |
| Negative acceptance regressions             | **2 deliberately incorrect fixes fail**                                                                                          |
| Dependency audit                            | **0 reported vulnerabilities**, including dev dependencies at validation time                                                    |
| Health endpoint                             | HTTP 200; version 1.0.0, engine v1                                                                                               |
| Response hardening                          | Verified CSP frame/object/base restrictions, nosniff, DENY framing, referrer and device-permission headers                       |
| WebMCP in supported browser                 | Both tools registered; full scene read; valid selection updates visible radio; invalid choice rejects without changing selection |
| Independent follow-up review                | No remaining blockers in reviewed code, privacy fixes, and evaluation acceptance changes                                         |

## Reproduce

```bash
npm ci
npm run check
npm run eval:verify
npm audit
npm run build
npm run start -- --port 4317
# In a second terminal:
PLAYWRIGHT_BASE_URL=http://localhost:4317 npm run test:e2e
```

Browser tests cover all three full episodes, revising prior answers, reload/resume, cross-tab deletion, invalid storage, malformed links, public results without evidence, PNG download, character search/detail, chemistry selection/randomizer, keyboard radio controls, 404 responses, responsive overflow, and no POST of answers during ordinary play.

The property suite uses fixed seeds and includes 1,500 complete generated episodes plus other input invariants. The Python oracle independently checks 300 complete and partial episodes. The sharing evaluation exhaustively checks 30,000 valid aggregate combinations. Counts inside property/acceptance loops are not mislabeled as separate test cases.

Coverage is scoped to `scoring`, `sharing`, `storage`, `chemistry`, and the scoring API. It is **not** a claim of 96% UI coverage. The report omits fully covered files from its abbreviated console table; the detailed coverage artifact includes them.

## Performance observations

On this development machine (Node 22.16.0, macOS arm64), a warm 150,000-iteration benchmark measured **4 μs median batch-mean scoring time**, with a 6 μs p95 batch mean. This excludes rendering, network, cold starts, and contention; it is not a per-request p95 or service SLA. Reproduce with `npm run benchmark`.

The single shared WebP artwork is **147,176 bytes**, down from approximately 2 MB for the generated PNG. Browser public build output was approximately 1.2 MB total on disk, including all route chunks/fonts; that is not the initial transferred page weight. The performance evaluation uses deterministic scene-ID lookup counts rather than machine-dependent timings.

## Manual visual checks

Inspected the home screen, quiz controls, and character result in the in-app browser, including a 390 × 844 phone viewport. Automated overflow checks run in both configured browser projects. The original four mascot families are reused across 16 distinct written archetypes.

## Known limits

- Chromium desktop and a mobile viewport are tested. This is not a claim of real iOS Safari, Firefox, every assistive technology, or exhaustive WCAG conformance.
- No sustained public-traffic load test, long-term uptime history, independent penetration test, or SLA.
- Vinext is a beta dependency; future peer upgrades require another production-browser pass.
- The Python evaluation runner is for trusted local code. It is not a security sandbox and buffers subprocess output before truncating reported output.
- Aggregate links reveal tendencies and can support inference. They are not encrypted, authenticated, or revocable. Generated links coarsen strong scores and omit answer history.
- There is no scientific personality validation or relationship prediction.

Hosted release status and CI are linked from the repository. Local results above remain distinguishable from hosted CI results.
