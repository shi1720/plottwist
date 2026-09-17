/** Tab-local provenance uses an opaque save revision, never a second answer history. */
export const LOCAL_RESULT_KEY = "plottwist.result-context.v1";
export function matchesLocalResult(
  serialized: string | null,
  token: string,
  nonce: string | null,
  revision: unknown,
): boolean {
  if (
    !serialized ||
    !nonce ||
    !/^[a-f0-9-]{36}$/.test(nonce) ||
    typeof revision !== "string" ||
    !/^[a-f0-9-]{36}$/.test(revision)
  )
    return false;
  try {
    const context: unknown = JSON.parse(serialized);
    return (
      typeof context === "object" &&
      context !== null &&
      "token" in context &&
      context.token === token &&
      "nonce" in context &&
      context.nonce === nonce &&
      "revision" in context &&
      context.revision === revision
    );
  } catch {
    return false;
  }
}
