export function GET() {
  return Response.json(
    { status: 'ok', app: 'plottwist', version: '1.0.0', engine: 'v1' },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
