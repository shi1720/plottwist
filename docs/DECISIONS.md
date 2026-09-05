# Architecture decision records

## ADR-001: deterministic scoring over an LLM personality classifier

**Decision:** use a transparent four-axis integer scoring engine and original written archetypes.

**Reason:** results should be reproducible, cheap, inspectable, and independent of a third-party model's availability. A playful quiz does not require opaque inference or a secret API key.

**Tradeoff:** less open-ended personalization. This is deliberately entertainment, not an assessment validated against real-world outcomes.

## ADR-002: local-first state over accounts and a database

**Decision:** per-episode browser storage, strict parsing, and no app-owned account system.

**Reason:** visitors can finish the primary experience immediately; their answer histories do not need to leave the browser. A database would add operational and privacy work without improving the specified journey.

**Tradeoff:** progress does not sync across devices. Clearing browser data removes it. Concurrent same-episode tabs use last-writer-wins; deletion events reset stale open state.

## ADR-003: coarse aggregate result URLs

**Decision:** serialize signs and tendency categories; cap magnitudes at 5 before sharing.

**Reason:** exact ±9 scores allow reconstruction of all three contributing choices. Broad categories preserve the playful result while reducing that inference. Never serialize names or answer history.

**Tradeoff:** a recipient sees a coarser marker than the owner with local evidence. Links still disclose tendencies and cannot be revoked or authenticated.

## ADR-004: independent reference and negative controls

**Decision:** verify TypeScript outputs with a standard-library Python implementation, and retain deliberately incorrect candidate solutions in the evaluation suite.

**Reason:** tests that mirror the implementation can reproduce its mistakes. Baseline fail/golden pass is necessary but not sufficient; a plausible wrong fix should also fail.

**Tradeoff:** maintaining a second implementation and frozen fixtures takes discipline. The tasks are transparent examples, not hidden or tamper-proof evaluations.

## ADR-005: one compressed art atlas (superseded)

The initial release reused four illustrated families to keep transfer size small. User feedback and the design judge found that repeated silhouettes made the sixteen identities hard to distinguish.

## ADR-006: individual portraits and presentation-only storytelling

**Decision:** replace the atlas with sixteen separately generated, 640 × 640 WebP portraits. A single code-to-path helper serves every character surface, including PNG export. Three-act framing, choice-specific reactions, and fictional character cold opens are separate from scoring.

**Reason:** visual identity is part of the product, not interchangeable decoration. Keeping narrative presentation outside the frozen scoring contract allows copy improvements without breaking existing shared links.

**Tradeoff:** more total image bytes and requests (roughly 22–35 KB per portrait). Intrinsic dimensions prevent layout shifts; offscreen gallery images load lazily. The story is authored character fiction, not an LLM-generated psychological inference. The result explicitly labels it as fiction, while a separate local-only callback quotes a real selected answer.
