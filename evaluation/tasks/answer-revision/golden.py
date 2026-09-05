"""Canonical replacement: preserve order, input immutability, and unaffected answers."""
def revise(answers, scene_id, choice_id):
    replacement = {'sceneId': scene_id, 'choiceId': choice_id}
    result = [dict(answer) for answer in answers]
    for index, answer in enumerate(result):
        if answer['sceneId'] == scene_id:
            result[index] = replacement
            return result
    result.append(replacement)
    return result
