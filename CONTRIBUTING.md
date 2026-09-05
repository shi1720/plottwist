# Contributing

Use Node 22 and Python 3.9+. Install with `npm ci`. Keep changes focused and describe observable before/after behavior.

Before opening a pull request:

```bash
npm run check
npm run eval:verify
npm run build
npm run test:e2e
```

Format owned code using `npx oxfmt app components/plot lib tests scripts docs`. The `components/ui` directory is scaffolded third-party primitive code; avoid changing it to restyle the product. Compose at call sites.

## Content changes

Do not casually change v1 scene IDs, choice IDs, weights, axis order, or character mapping. They are part of a compatibility contract. Add a new version with explicit decoding rules for semantic changes. New scenes must have balanced weights, equal axis coverage, a single understandable tradeoff, and original wording. Avoid diagnostic claims or copyrighted character impersonations.

## Test quality

Add a regression that fails before the fix. Prefer invariants and independently specified outputs over tests that simply repeat the implementation. For performance, enforce deterministic work or payload budgets before using timing thresholds. Seed generated tests and include reproduction commands.

## Lint policy

Vendored UI components are excluded from repository linting; TypeScript still checks them. React Compiler-only diagnostics are disabled because this app does not enable React Compiler, and browser-state hydration effects are intentional. Hook correctness remains enabled. Native anchors and pre-compressed static images are deliberate architecture decisions; the Next-specific navigation/image prescriptions are disabled. Role preferences are disabled where custom visualizations/asset crops require accessible alternative descriptions. Accessibility is checked with actual browser scans and keyboard journeys.

## Evaluation tasks

Each task needs a precise contract, baseline, golden implementation, acceptance suite, patch, and refreshed source hashes. `verify-all` must show the baseline failing the target checks and the golden passing. Do not put secrets, third-party source without permission, or adversarial code in the trusted local runner.
