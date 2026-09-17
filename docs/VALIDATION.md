# Release validation

## Editorial redesign — 2026-09-07

- **41 unit/property/API/differential/content tests pass** across six files; strict TypeScript and lint pass. Scoring/API coverage remains 95.52% statements, 93.63% branches, 100% functions, 96.52% lines. This does not measure UI coverage.
- **38 browser tests pass against the production Worker**, in desktop and mobile Chromium. All three complete quizzes, resume/revision, sixteen portraits, error states, keyboard controls, comparison, and local storage behavior are covered.
- New regressions exercise the actual clipboard link, coarse-token collisions, cross-tab answer edits, clearing an open result, and a session context with no duplicate answer history.
- PNG download checks verify the PNG signature and 1080 × 1350 dimensions; an exported card was also visually inspected.
- Automated accessibility scans cover home, quiz, result, cast, comparison and privacy with WCAG 2 A/AA and 2.1 AA rules; no reported violations in these scans.
- Production build succeeds. Three evaluation baselines fail, three golden solutions pass, and two negative regressions fail as expected. Dependency audit reports **zero vulnerabilities** at validation time.
- Twelve desktop/mobile production renders reviewed. An independent LLM editorial judge scored the design **82/100**, up from **52.5/100** under the same rubric; a separate code reviewer found no remaining blocking issue after the provenance fixes. [Full review and caveats](EDITORIAL_REVIEW.md).
- Documentation now describes opaque save revisions, generic shared summaries, and conservative invalidation of old personal receipts. Longer fiction is optional and the interface uses plain labels.

The sections below preserve historical release evidence; their earlier visual descriptions and test counts are superseded by this entry.

## Character and storytelling update — 2026-09-05

Executed after the first release, against the revised production Worker:

- **39 unit/property/API/differential/content tests pass** across 5 files; strict TypeScript and lint pass. Scoring/API coverage remains 95.52% statements, 93.63% branches, 100% functions, 96.52% lines.
- **32 browser tests pass** in desktop and mobile Chromium, including all three complete episodes, save/share/export, keyboard controls, automated accessibility scans, and the new portrait/reaction/navigation regressions.
- All **16 distinct portrait URLs load** in both browser projects; all character assets are unique WebPs with a total size of **474,676 bytes** (21,768–34,674 each). Each has intrinsic dimensions and a matching alt description.
- All **144 reactions are unique**. The frozen v1 IDs, weights and character names pass the contract check; existing shared links retain their identity.
- **Three evaluation baselines fail, three golden solutions pass, and two negative regressions fail** as expected.
- Reviewed desktop and 390 × 844 mobile renders. Independent LLM product judging used a frozen six-category rubric; a separate code reviewer checked runtime, privacy and presentation regressions. See [judge report](DESIGN_REVIEW.md).
- Browser navigation now stays visible on mobile; current act framing appears above mobile scenes. Shared results offer “Play this episode”; matching local results retain “Revisit my answers.”

The historical release evidence below describes version 1.0.0 before this design update, including its now-superseded four-family atlas.

## Initial release

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

## Hosted release verification

The [clean Linux GitHub Actions run](https://github.com/shi1720/plottwist/actions/runs/33969147148) passed the complete pipeline, including the production-Worker browser suite. The [public deployed app](https://plottwist-shi1720.web.app) returned a successful health response and rendered without a sign-in gate in the browser. The public entry point was subsequently moved to Firebase; see [Firebase verification](FIREBASE.md).
