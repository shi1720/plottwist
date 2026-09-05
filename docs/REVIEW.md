# Independent review and iteration

This project was developed with AI assistance and independent review agents. Findings were treated as defects to reproduce, not merely suggestions to acknowledge.

## Product/architecture review

Recommendations adopted:

- Keep answers as the source of truth; derive results on every revision.
- Make ties and incomplete states explicit.
- Share aggregate tendencies instead of full answer histories.
- Freeze versioned content semantics.
- Use an independent Python oracle and reproducible fail/pass tasks.
- Describe chemistry as fictional narrative, without a predictive compatibility score.

## Code/privacy review

| Finding                                           | Reproduction                                         | Resolution                                                                                    |
| ------------------------------------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Extreme aggregate scores reveal exact answers     | An axis of +9 uniquely identifies three +3 choices   | Generated links cap magnitude at 5; strong scores share one broad category; regression test   |
| Cross-tab deletion can be undone                  | Clear data in tab B; tab A later autosaves old state | Listen for storage deletion and reset the active quiz; two-tab browser regression             |
| Sparse answer arrays bypass completion validation | `Array(12)` skips `.map` callbacks                   | Use `Array.from` validation so holes become rejected values; unit regression                  |
| Agent scene omits question context                | Structured read lacks setting/detail                 | Return the same complete context as the visible scene; supported-browser valid/invalid checks |
| Compressed source hurts maintainability           | Components initially authored in compact patches     | Format owned source and document lint decisions                                               |

The follow-up review confirmed those four functional findings resolved and the unit suite passing.

## Evaluation review

Two superficially plausible fixes initially passed insufficient acceptance tests:

- Copying the scene list hid later quadratic scans from the outer-list counter. Meter ID access on records instead, so outer copies cannot evade the check. Retain `negative-copy.py` and require it to fail.
- Returning `pilot` for every decoded token passed tests that only asserted raw values and key names. Assert the entire result for all 30,000 combinations and retain `negative-pack.py` as a required failing regression.

The runner's documentation was also corrected: it truncates reported output after subprocess execution; it does not promise bounded subprocess capture or security isolation.

## Browser review

Actual desktop/mobile journeys identified:

- Insufficient contrast in the orange display heading and muted quiz hint.
- A pre-hydration search input that accepted typing before its event handler was available.
- A shared color token change that improved headline contrast but reduced button text contrast.

Fixes: separate accessible display-orange and button-surface tokens, darken the hint, and disable search until hydration is complete. Revalidate against the production Worker, not just the dev server.

## Boundaries

Review agents did not certify psychological validity, security against arbitrary untrusted execution, Safari/Firefox support, long-term uptime, or scale. The repository's validation document distinguishes tested behavior from those untested claims.
