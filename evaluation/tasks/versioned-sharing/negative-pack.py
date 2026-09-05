import re


def decode(token):
    if not isinstance(token, str) or len(token) > 80:
        raise ValueError('Invalid result')
    match = re.fullmatch(r'v1\.(pilot|office|friends)\.(-?[13579])_(-?[13579])_(-?[13579])_(-?[13579])', token)
    if not match:
        raise ValueError('Unsupported or invalid result')
    values = [int(value) for value in match.groups()[1:]]
    return {'version': 1, 'packId': 'pilot', 'raw': values,
            'code': ''.join('1' if value > 0 else '0' for value in values)}
