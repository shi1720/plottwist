"""Task: revise one answer without losing another scene or double-counting points."""
def revise(answers, scene_id, choice_id):
    # BUG: appending makes a duplicate answer the scorer must reject.
    return answers + [{'sceneId': scene_id, 'choiceId': choice_id}]
