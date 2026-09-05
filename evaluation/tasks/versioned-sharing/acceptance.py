import itertools
import unittest
from candidate import decode


class ShareTests(unittest.TestCase):
    def test_fixed_regression(self):
        self.assertEqual(decode('v1.pilot.9_-3_1_-9'),
                         {'version': 1, 'packId': 'pilot', 'raw': [9, -3, 1, -9], 'code': '1010'})

    def test_every_valid_aggregate_in_every_pack(self):
        for pack in ['pilot', 'office', 'friends']:
            for values in itertools.product([-9, -7, -5, -3, -1, 1, 3, 5, 7, 9], repeat=4):
                decoded = decode('v1.' + pack + '.' + '_'.join(map(str, values)))
                self.assertEqual(decoded, {'version': 1, 'packId': pack, 'raw': list(values),
                                           'code': ''.join('1' if n > 0 else '0' for n in values)})

    def test_rejects_untrusted_input(self):
        invalid = [None, 42, {}, '', 'x' * 1000, 'v2.pilot.1_1_1_1',
                   'v1.unknown.1_1_1_1', 'v1.pilot.0_1_1_1', 'v1.pilot.2_1_1_1',
                   'v1.pilot.01_1_1_1', 'v1.pilot.1_1_1_1\n', 'v1.pilot.1_1_1_1.x',
                   'v1.pilot.NaN_1_1_1', 'v1.pilot.1_1_1_1<script>']
        for token in invalid:
            with self.subTest(token=token):
                with self.assertRaises(ValueError):
                    decode(token)
