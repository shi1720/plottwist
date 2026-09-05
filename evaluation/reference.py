"""Independent Python 3 reference for the frozen v1 TypeScript scoring contract.

No dependencies, web requests, or mutable score cache. Used as a differential oracle.
"""
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PACKS = json.loads((ROOT / 'lib/content/packs.json').read_text())


def score(pack_id, answers):
    pack = next((p for p in PACKS if p['id'] == pack_id), None)
    if pack is None or not isinstance(answers, list) or len(answers) > len(pack['scenes']):
        raise ValueError('Invalid input')
    scenes = {s['id']: s for s in pack['scenes']}
    seen, totals, maxima = set(), [0] * 4, [0] * 4
    for answer in answers:
        if not isinstance(answer, dict):
            raise ValueError('Invalid answer')
        scene_id, choice_id = answer.get('sceneId'), answer.get('choiceId')
        if scene_id in seen or scene_id not in scenes:
            raise ValueError('Invalid or duplicate scene')
        seen.add(scene_id)
        scene = scenes[scene_id]
        choice = next((c for c in scene['choices'] if c['id'] == choice_id), None)
        if choice is None:
            raise ValueError('Invalid choice')
        for dimension, contribution in enumerate(choice['weights']):
            totals[dimension] += contribution
            maxima[dimension] += max(abs(c['weights'][dimension]) for c in scene['choices'])
    return {
        'raw': totals,
        'scores': [math.floor(50 + 50 * raw / maximum + .5) if maximum else 50
                   for raw, maximum in zip(totals, maxima)],
        'code': ''.join('1' if value > 0 else '0' for value in totals),
        'complete': len(answers) == len(pack['scenes']),
    }


if __name__ == '__main__':
    import sys
    for line in sys.stdin:
        try:
            payload = json.loads(line)
            print(json.dumps(score(payload['packId'], payload['answers'])))
        except (ValueError, KeyError, TypeError) as exc:
            print(json.dumps({'error': str(exc)}))
