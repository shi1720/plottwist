import random
import unittest
from candidate import revise


class RevisionTests(unittest.TestCase):
    def test_regression_replace_not_append(self):
        before = [{'sceneId': 'pilot-1', 'choiceId': 'pilot-1-1'},
                  {'sceneId': 'pilot-2', 'choiceId': 'pilot-2-2'}]
        after = revise(before, 'pilot-1', 'pilot-1-4')
        self.assertEqual(after, [{'sceneId': 'pilot-1', 'choiceId': 'pilot-1-4'}, before[1]])
        self.assertEqual(before[0]['choiceId'], 'pilot-1-1')

    def test_generated_edit_traces_match_latest_choice_oracle(self):
        rng, actual, expected = random.Random(1720), [], {}
        for _ in range(1000):
            scene, choice = 'scene-' + str(rng.randrange(12)), 'choice-' + str(rng.randrange(4))
            actual = revise(actual, scene, choice)
            expected[scene] = choice
            self.assertEqual(len(actual), len(expected))
            self.assertEqual(actual, [{'sceneId': s, 'choiceId': c} for s, c in expected.items()])

    def test_result_does_not_alias_old_records(self):
        before = [{'sceneId': 'one', 'choiceId': 'a'}]
        after = revise(before, 'two', 'b')
        after[0]['choiceId'] = 'mutated'
        self.assertEqual(before[0]['choiceId'], 'a')
