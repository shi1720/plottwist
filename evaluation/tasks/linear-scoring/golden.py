"""O(scenes + answers) scene visits, four choices per scene by contract."""
def aggregate(scenes, answers):
    index = {scene['id']: scene for scene in scenes}
    raw, seen = [0, 0, 0, 0], set()
    for answer in answers:
        if answer['sceneId'] in seen:
            raise ValueError('Duplicate scene')
        seen.add(answer['sceneId'])
        scene = index.get(answer['sceneId'])
        if scene is None:
            raise ValueError('Unknown scene')
        choice = next((c for c in scene['choices'] if c['id'] == answer['choiceId']), None)
        if choice is None:
            raise ValueError('Unknown choice')
        raw = [a + b for a, b in zip(raw, choice['weights'])]
    return raw
