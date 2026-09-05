#!/usr/bin/env python3
"""Reproduce task baselines and golden fixes in clean temporary directories.

This is a trusted local evaluation runner, NOT a sandbox for untrusted code.
Candidate code executes with your OS privileges. Use a separate container/VM for
untrusted submissions. The timeout bounds duration, not filesystem/network access.
"""
import argparse
import hashlib
import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent
TASKS = ROOT / 'tasks'


def run(task, variant, candidate=None):
    source = candidate or task / (variant + '.py')
    manifest = json.loads((task / 'task.json').read_text())
    if not candidate:
        actual = hashlib.sha256(source.read_bytes()).hexdigest()
        if actual != manifest['sha256'][variant]:
            raise ValueError('Task fixture hash mismatch: ' + str(source))
    with tempfile.TemporaryDirectory(prefix='plottwist-eval-') as directory:
        work = Path(directory)
        shutil.copy2(source, work / 'candidate.py')
        shutil.copy2(task / 'acceptance.py', work / 'test_acceptance.py')
        try:
            result = subprocess.run([sys.executable, '-I', '-c',
                                     "import sys, unittest; sys.path.insert(0, '.'); "
                                     "suite=unittest.defaultTestLoader.discover('.', pattern='test_*.py'); "
                                     "r=unittest.TextTestRunner(verbosity=1).run(suite); "
                                     "sys.exit(not r.wasSuccessful())"],
                                    cwd=work, capture_output=True, text=True, timeout=20)
            return {'task': task.name, 'variant': variant,
                    'passed': result.returncode == 0,
                    'output': (result.stdout + result.stderr)[-6000:]}
        except subprocess.TimeoutExpired:
            return {'task': task.name, 'variant': variant, 'passed': False, 'output': '20-second timeout'}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('command', choices=['verify-all', 'run', 'list'])
    parser.add_argument('--task', choices=sorted(p.name for p in TASKS.iterdir() if p.is_dir()))
    parser.add_argument('--variant', choices=['baseline', 'golden'], default='baseline')
    parser.add_argument('--candidate', type=Path)
    args = parser.parse_args()
    if args.command == 'list':
        for task in sorted(TASKS.iterdir()):
            print((task / 'task.json').read_text())
        return 0
    if args.command == 'run':
        if not args.task:
            parser.error('--task is required')
        result = run(TASKS / args.task, args.variant, args.candidate.resolve() if args.candidate else None)
        print(json.dumps(result, indent=2))
        return 0 if result['passed'] else 1
    results = [run(task, variant) for task in sorted(TASKS.iterdir()) for variant in ['baseline', 'golden']]
    for task in sorted(TASKS.iterdir()):
        for negative in sorted(task.glob('negative-*.py')):
            results.append(run(task, negative.stem, negative))
    for result in results:
        print(f"{result['task']:20} {result['variant']:8} {'PASS' if result['passed'] else 'FAIL (expected for baseline)'}")
    verified = all(r['passed'] == (r['variant'] == 'golden') for r in results)
    print(json.dumps({'verified': verified, 'tasks': len(list(TASKS.iterdir())), 'negative_regressions': len(results) - 6}))
    if not verified:
        print(json.dumps(results, indent=2))
    return 0 if verified else 1


if __name__ == '__main__':
    sys.exit(main())
