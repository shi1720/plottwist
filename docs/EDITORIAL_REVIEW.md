# Editorial redesign review — 2026-09-07

## Brief and method

The user found the existing site too AI-like and asked for clearer, more thoughtful language and a complete release. The design goal was a recognizable personality quiz whose humor comes from specific situations, rather than jokes in every interface label.

An independent LLM agent judged the baseline and revisions using the rubric below. A separate agent reviewed functionality and privacy. Both were read-only reviewers; the implementation agent made changes and ran browser verification. The editorial reviewer saw the task and revision context, so this was collaborative critique, not blinded evaluation or a user study. Scores are qualitative judgments, not conversion metrics or proof of production reliability.

The rubric was fixed before redesign: 0 absent, 5 generic/uneven, 8 strong with minor issues, 10 exceptional. The baseline included five desktop screenshots plus source/content review. The revised and final passes each included twelve screenshots: home, cast, quiz, shared result, comparison and privacy at 1440 × 1000 and 390 × 844. This expanded mobile evidence makes the later assessment more comprehensive, not experimentally controlled.

| Criterion                     |   Weight | Baseline /10 | First revision /10 | Final /10 |
| ----------------------------- | -------: | -----------: | -----------------: | --------: |
| First-visit clarity           |      25% |            6 |                8.5 |       8.5 |
| Editorial voice               |      25% |            4 |                7.5 |         8 |
| Visual restraint and identity |      20% |            4 |                  8 |         8 |
| Journey coherence             |      15% |            6 |                7.5 |       8.5 |
| Usability                     |      15% |            7 |                7.5 |         8 |
| **Weighted total /100**       | **100%** |     **52.5** |           **78.5** |    **82** |

The reviewer initially reported the first revision as 78.75; the table uses the correct weighted sum of its category scores. The September 5 review used a different rubric; its scores are historical and not directly comparable.

## Feedback acted on

| Finding                                                                            | Implemented response                                                                                                                                 |
| ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Constant punchlines obscure actions                                                | Plain navigation, episode subtitles, question progress, error messages and sharing controls. Humor stays in scenes, reactions and character writing. |
| Repeated badges, heavy outlines, decorative marks and blocks compete for attention | Cream and forest palette, serif headings, hairline separators, generous space, three simple episode rows and an open portrait gallery.               |
| Opening takes too long to explain the product                                      | “Who are you in the group chat?” followed by 12 questions, 16 original characters, three minutes and no account.                                     |
| Results lead with lengthy fiction                                                  | Character and sharing controls precede optional fiction. Personal evidence and public summaries have distinct labels.                                |
| Mobile comparison truncates character names                                        | Select values wrap; controls wait for hydration before accepting changes.                                                                            |
| Cast props lack context                                                            | Explicit “Usually carries” label; each frozen character keeps its unique portrait.                                                                   |
| Shared results address recipients as though they answered                          | Conditional wording distinguishes a local result from a shared character summary.                                                                    |

The final reviewer found no editorial or layout blockers in the supplied captures. Remaining non-blocking observations: repeated tagline on a shared result, slight comparison-portrait misalignment when selectors wrap to different heights, and a long mobile character catalogue. These are recorded rather than represented as a perfect score.

## Independent engineering findings

1. **Coarse-token collision:** two different complete answer sets can intentionally share the same public token. The previous result page could attach unrelated local receipts. Public links now omit a tab-local nonce and never inherit receipts based on a token alone.
2. **Cross-tab replacement:** editing an answer in another tab could replace receipts on an older result. A random save revision now binds the exact saved state to that result; later saves remove old receipts until the result is revealed again.
3. **Duplicate answer storage:** an intermediate serialized-answer fingerprint created a second answer copy. It was rejected and replaced with an opaque UUID revision. Session context contains only the public summary token and opaque identifiers.
4. **Early privacy click:** a mobile test caught a click before hydration that appeared to do nothing. The clear-data control is disabled until ready, and browser tests check the confirmation and removal of open result evidence.

The final code reviewer independently ran 41 tests and found no remaining blocking issue in the reviewed changes. The owner completed 38 production browser tests, including the actual copied-link round trip, cross-tab edits/deletion, PNG signature and dimensions, and automated accessibility scans. See [validation](VALIDATION.md) for scope and limits.
