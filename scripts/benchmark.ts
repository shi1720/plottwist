import { performance } from 'node:perf_hooks';
import { PACKS } from '../lib/content/packs';
import { scoreAnswers } from '../lib/engine/scoring';
const pack = PACKS[0],
  answers = pack.scenes.map((s) => ({
    sceneId: s.id,
    choiceId: s.choices[0].id,
  }));
for (let i = 0; i < 10000; i++) scoreAnswers(pack, answers);
const batches = Array.from({ length: 15 }, () => {
  const begin = performance.now();
  for (let i = 0; i < 10000; i++) scoreAnswers(pack, answers);
  return (performance.now() - begin) / 10000;
}).sort((a, b) => a - b);
console.log(
  JSON.stringify(
    {
      node: process.version,
      platform: process.platform,
      arch: process.arch,
      iterations: 150000,
      medianMicroseconds: Math.round(batches[7] * 1000),
      p95BatchMeanMicroseconds: Math.round(batches[14] * 1000),
      note: 'Local warm microbenchmark. Not a latency SLA. Performance task uses deterministic operation counts.',
    },
    null,
    2,
  ),
);
