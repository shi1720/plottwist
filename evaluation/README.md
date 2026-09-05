# Plot Twist engineering evaluation lab

Three compact, real software-engineering exercises derived from the product's contracts. This is a reproducible local task package for reviewing agent or human coding work—not a hosted RL service or an untrusted-code sandbox.

| Task                | Type        | What breaks or is missing                                  | Acceptance evidence                                                         |
| ------------------- | ----------- | ---------------------------------------------------------- | --------------------------------------------------------------------------- |
| `answer-revision`   | Bug fixing  | Appending a revised answer creates duplicate scene records | Fixed trace, 1,000 seeded edits, non-aliasing records                       |
| `versioned-sharing` | Feature     | Strict versioned aggregate decoder is missing              | 30,000 valid combinations, explicit malformed inputs, privacy-shaped output |
| `linear-scoring`    | Performance | Re-scans the catalog for every answer                      | Correctness + deterministic O(S+A) catalog-visit budget                     |

Two deliberately incorrect “fixes” (a copied-but-still-quadratic catalog and an always-pilot decoder) are retained as negative acceptance regressions and must also fail.

Every task has `task.json`, `baseline.py`, `golden.py`, `golden.patch`, and `acceptance.py`. The baseline/golden SHA-256 values prevent accidentally running changed fixtures under the old contract. Dependencies: Python standard library only, 3.9+.

```bash
python3 evaluation/runner.py list
python3 evaluation/runner.py verify-all
python3 evaluation/runner.py run --task answer-revision --variant baseline # expected exit 1
python3 evaluation/runner.py run --task answer-revision --variant golden   # expected exit 0
```

To work on a trusted local candidate:

```bash
cp evaluation/tasks/answer-revision/baseline.py /tmp/candidate.py
# Edit /tmp/candidate.py
python3 evaluation/runner.py run --task answer-revision --candidate /tmp/candidate.py
```

Or reproduce the golden patch:

```bash
mkdir -p /tmp/plottwist-patch-demo
cp evaluation/tasks/answer-revision/baseline.py /tmp/plottwist-patch-demo/candidate.py
(cd /tmp/plottwist-patch-demo && patch -p0 < /absolute/path/to/plottwist/evaluation/tasks/answer-revision/golden.patch)
```

Each run copies the candidate and acceptance suite into a new temporary directory, invokes isolated Python import mode, enforces a 20-second timeout, truncates reported output after execution, and removes the temporary files afterward. It never edits the live application. Acceptance tests are visible: this is a transparent example task suite, not a hidden benchmark claiming resistance to test overfitting.

**Security boundary:** candidate Python executes with the current user's OS privileges and can access the filesystem/network. Only run trusted local code. For untrusted submissions, use a separate VM or hardened container, read-only mounts, a non-root UID, disabled networking, and CPU/memory/process limits. This repository does not claim those controls are provided by the local runner.

`reference.py` is an independent full scoring implementation, also used in TypeScript differential tests. It reads the same frozen content but independently implements validation, aggregation, normalization, rounding, and character code generation.
