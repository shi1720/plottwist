import unittest
from candidate import aggregate


class MeteredScene(dict):
    """ID lookups remain metered even when the outer catalog is copied."""
    def __getitem__(self, key):
        if key == 'id':
            self.counter[0] += 1
        return super().__getitem__(key)


class MeteredScenes(list):
    def __init__(self, values):
        self.counter = [0]
        records = []
        for value in values:
            record = MeteredScene(value)
            record.counter = self.counter
            records.append(record)
        super().__init__(records)

    @property
    def visits(self):
        return self.counter[0]


def fixture(size):
    scenes = MeteredScenes([{'id': str(i), 'choices': [{'id': 'a', 'weights': [1, -1, 3, -3]}]}
                            for i in range(size)])
    return scenes, [{'sceneId': str(i), 'choiceId': 'a'} for i in reversed(range(size))]


class PerformanceTests(unittest.TestCase):
    def test_preserves_output(self):
        scenes, answers = fixture(13)
        self.assertEqual(aggregate(scenes, answers), [13, -13, 39, -39])

    def test_linear_work_budget(self):
        for size in [32, 128, 512]:
            scenes, answers = fixture(size)
            self.assertEqual(aggregate(scenes, answers), [size, -size, 3 * size, -3 * size])
            self.assertLessEqual(scenes.visits, 2 * size,
                                 'Index the catalog once instead of scanning it per answer')

    def test_rejects_bad_records(self):
        scenes, answers = fixture(3)
        for bad in [answers + answers[:1], [{'sceneId': '99', 'choiceId': 'a'}],
                    [{'sceneId': '0', 'choiceId': 'missing'}]]:
            with self.assertRaises(ValueError):
                aggregate(scenes, bad)

    def test_empty_input(self):
        self.assertEqual(aggregate([], []), [0, 0, 0, 0])
