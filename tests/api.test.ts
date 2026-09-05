import { describe, it, expect } from 'vitest';
import { POST } from '../app/api/score/route';
import { GET } from '../app/api/health/route';
import { getPack } from '../lib/content/packs';
const request = (body: string, type = 'application/json') =>
  new Request('http://localhost/api/score', {
    method: 'POST',
    headers: { 'content-type': type },
    body,
  });
describe('stateless scoring API', () => {
  it('reports health', async () =>
    expect(await GET().json()).toMatchObject({ status: 'ok', engine: 'v1' }));
  it('returns a validated score without caching', async () => {
    const p = getPack('pilot');
    const response = await POST(
      request(
        JSON.stringify({
          packId: p.id,
          answers: p.scenes.map((s) => ({
            sceneId: s.id,
            choiceId: s.choices[0].id,
          })),
        }),
      ),
    );
    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(await response.json()).toMatchObject({
      complete: true,
      answered: 12,
    });
  });
  it('requires JSON', async () =>
    expect((await POST(request('{}', 'text/plain'))).status).toBe(415));
  it('rejects malformed and invalid requests', async () => {
    for (const body of [
      '{',
      'null',
      '{}',
      '{"packId":"x","answers":[]}',
      '{"packId":"pilot","answers":[{}]}',
    ])
      expect((await POST(request(body))).status).toBe(400);
  });
  it('rejects streamed payloads over 8 KiB regardless of declared length', async () => {
    expect((await POST(request('x'.repeat(8193)))).status).toBe(413);
  });
  it('rejects a missing body', async () => {
    expect(
      (
        await POST(
          new Request('http://localhost/api/score', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
          }),
        )
      ).status,
    ).toBe(400);
  });
});
