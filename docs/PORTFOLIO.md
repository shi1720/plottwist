# Portfolio and application pitch

## A short description

**Plot Twist** is an original personality sitcom: 36 everyday dilemmas, 16 character archetypes, and a fictional cast chemistry mixer. It combines a shareable consumer experience with inspectable scoring, careful local-state behavior, privacy-conscious sharing, and reproducible software engineering evaluations.

## Suggested application paragraph

> I built Plot Twist, a TypeScript/React application with an explainable scoring engine, resumable interactive episodes, private local evidence, and versioned aggregate sharing. The repository includes property tests, an independent Python scoring oracle, production-browser journeys, and three reproducible engineering tasks covering bug fixing, feature implementation, and performance optimization. Each task ships a broken baseline, explicit acceptance contract, golden solution and patch, and a runner that verifies the expected fail/pass transition. The architecture and review log document design tradeoffs and concrete defects found and corrected during development.

Only use wording you can personally explain. This project was developed with AI assistance and review; that is documented openly. It should be a starting point for a technical discussion, not a claim of unassisted authorship, prior employment, years of maintenance, or real user scale.

## A five-minute technical walkthrough

1. **Play one episode.** Show answer revision and reload/resume. Explain why answers, not totals, are persisted.
2. **Open the result.** Show the four tendencies, local evidence, and a share link with no answer history. Explain why exact extreme aggregates were coarsened after review.
3. **Read `lib/engine/scoring.ts`.** Explain validation, index complexity, tie policy, and why incomplete results cannot be shared.
4. **Run `npm run check`.** Point to seeded invariants and the independent Python oracle. Explain the rounding difference handled by Python's `floor(x + .5)`.
5. **Run `npm run eval:verify`.** Show a baseline failing and its golden solution passing. Explain operation-count budgets and why a temporary directory is not a security sandbox.

## Connection to environment-creation work

| Role activity             | Concrete repository evidence                                                           |
| ------------------------- | -------------------------------------------------------------------------------------- |
| Debugging                 | Duplicate-answer baseline; sparse-array and cross-tab regressions                      |
| Feature implementation    | Versioned-sharing task; complete result and chemistry flows                            |
| Refactoring               | Pure engine separated from UI/storage, canonical source of truth                       |
| Performance optimization  | Linear-index task and deterministic catalog-visit acceptance budget                    |
| Reproducible environment  | Locked npm dependency graph; no-dependency Python tasks; hashed fixtures; clean runner |
| Golden reference solution | Three golden implementations plus unified patches; independent oracle                  |
| Technical communication   | Architecture diagrams, compatibility rules, threat boundaries, review history          |

The project demonstrates TypeScript and Python. It does not claim Java, Rust, Go, or C++ expertise merely because those languages appeared in a job description.

## Honest boundaries

This is not a large-scale production case study or a psychometric instrument. The algorithm is intentionally straightforward; its value is that its behavior is inspectable, reproducible, testable, and well integrated into a complete product. For a senior interview, discuss the failure modes and tradeoffs as confidently as the visuals.
