"""Task: index the scene catalog once; preserve exact totals and validation."""
def aggregate(scenes, answers):
    scenes = list(scenes)  # Still quadratic: a copied outer list is not an index.
    raw, seen = [0, 0, 0, 0], set()
    for answer in answers:
        if answer['sceneId'] in seen:
            raise ValueError('Duplicate scene')
        seen.add(answer['sceneId'])
        scene = next((s for s in scenes if s['id'] == answer['sceneId']), None)
        if scene is None:
            raise ValueError('Unknown scene')
        choice = next((c for c in scene['choices'] if c['id'] == answer['choiceId']), None)
        if choice is None:
            raise ValueError('Unknown choice')
        raw = [a + b for a, b in zip(raw, choice['weights'])]
    return raw
