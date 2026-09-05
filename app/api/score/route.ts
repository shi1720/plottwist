import { getPack, isPackId } from '@/lib/content/packs';
import { scoreAnswers } from '@/lib/engine/scoring';
/** Stateless public reference API. Normal play scores locally; this endpoint never stores payloads. */
export async function POST(request: Request) {
  if (!request.headers.get('content-type')?.includes('application/json'))
    return Response.json({ error: 'Use application/json' }, { status: 415 });
  // Bound streamed input as well as declared Content-Length.
  const reader = request.body?.getReader();
  if (!reader)
    return Response.json({ error: 'Request body required' }, { status: 400 });
  let bytes = 0;
  const chunks: Uint8Array[] = [];
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 8192) {
        await reader.cancel();
        return Response.json({ error: 'Request too large' }, { status: 413 });
      }
      chunks.push(value);
    }
    const body = new Uint8Array(bytes);
    let offset = 0;
    for (const c of chunks) {
      body.set(c, offset);
      offset += c.byteLength;
    }
    const input = JSON.parse(new TextDecoder().decode(body));
    if (!input || !isPackId(input.packId) || !Array.isArray(input.answers))
      throw new Error('Valid packId and answers are required');
    const result = scoreAnswers(getPack(input.packId), input.answers);
    return Response.json(result, {
      headers: {
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : 'Invalid request' },
      { status: 400, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
