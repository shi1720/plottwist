import { expect, it } from "vitest";
import { matchesLocalResult } from "../lib/engine/result-context";
import { getPack } from "../lib/content/packs";
import { encodeResult } from "../lib/engine/sharing";
const nonce = "be365412-f28f-434c-bf92-23e46a1a2122";
const revision = "ee365412-f28f-434c-bf92-23e46a1a2122";
const revised = "de365412-f28f-434c-bf92-23e46a1a2122";
it("requires tab-local provenance and the exact saved revision, even for colliding summaries", () => {
  const pack = getPack("pilot");
  const a = pack.scenes.map((s) => ({
    sceneId: s.id,
    choiceId: s.choices[0].id,
  }));
  const b = a.map((answer, i) =>
    i === 0 ? { ...answer, choiceId: pack.scenes[0].choices[1].id } : answer,
  );
  const token = encodeResult("pilot", a);
  expect(encodeResult("pilot", b)).toBe(token);
  const stored = JSON.stringify({
    token,
    nonce,
    revision,
  });
  expect(matchesLocalResult(stored, token, null, revision)).toBe(false);
  expect(matchesLocalResult(stored, token, nonce, revision)).toBe(true);
  expect(matchesLocalResult(stored, token, nonce, revised)).toBe(false);
  expect(
    matchesLocalResult(
      stored,
      token,
      "ce365412-f28f-434c-bf92-23e46a1a2122",
      revision,
    ),
  ).toBe(false);
  expect(matchesLocalResult(stored, "v1.office.1_1_1_1", nonce, revision)).toBe(
    false,
  );
});
it("rejects damaged, missing, or older tab-local context", () => {
  for (const raw of [
    null,
    "null",
    "{",
    "42",
    "[]",
    "{}",
    '{"nonce":42}',
    JSON.stringify({ nonce, token: "x" }),
  ]) {
    expect(matchesLocalResult(raw, "x", nonce, undefined)).toBe(false);
  }
  expect(
    matchesLocalResult(
      JSON.stringify({ nonce, token: "x" }),
      "x",
      "bad",
      revision,
    ),
  ).toBe(false);
});
