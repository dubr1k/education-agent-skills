#!/usr/bin/env python3
"""Install a reviewed checkout into an explicit, empty Hermes destination.

No config, credentials, network calls, hooks or runtime services are touched.
"""
from pathlib import Path
import argparse
import hashlib
import json
import shutil
import subprocess

HERE = Path(__file__).resolve().parent
SOURCE = HERE.parents[1]


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def tracked_files():
    result = subprocess.run(['git', '-C', str(SOURCE), 'ls-files', '-z'],
                            check=True, capture_output=True)
    return [Path(p) for p in result.stdout.decode().split('\0') if p]


def install(destination):
    destination = Path(destination).expanduser().resolve()
    # Reject overlap with source, including a destination containing this checkout.
    if destination == SOURCE or SOURCE in destination.parents or destination in SOURCE.parents:
        raise ValueError('destination must be outside the source checkout')
    targets = TARGETS(destination)
    # Refuse symlinked parent components and dangling links before any write.
    for target in targets:
        for component in (target, *target.parents):
            if component == destination.parent:
                break
            if component.is_symlink():
                raise ValueError('symlink in installation destination')
        resolved = target.resolve()
        if destination not in resolved.parents:
            raise ValueError('destination escape')
    if any(p.exists() or p.is_symlink() for p in targets):
        raise FileExistsError('refusing to overwrite an existing installation; back it up separately')
    # Validate all inputs before writing.
    entries = ENTRIES(destination)
    for src, dst in entries:
        if not src.is_file() or src.is_symlink():
            raise ValueError('missing or symlinked source: ' + str(src.relative_to(SOURCE)))
        if destination not in dst.parents:
            raise ValueError('destination escape')
    for src, dst in entries:
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dst)
    FINISH(destination, entries)
    return destination


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--destination', required=True,
                        help='explicit active profile home or an isolated test home')
    args = parser.parse_args()
    try:
        install(args.destination)
    except (ValueError, FileExistsError, subprocess.CalledProcessError) as error:
        parser.exit(2, str(error) + '\n')
    print('Installed; start a new Hermes session to refresh skill discovery.')

def TARGETS(home):
    return [home / 'skills/education/education-skills-routing',
            home / 'education-hermes-install-manifest.json']


def ENTRIES(home):
    router = TARGETS(home)[0]
    data = json.loads((SOURCE / 'registry.json').read_text())
    ids = [s['id'] for s in data['skills']]
    if len(ids) != len(set(ids)) or len(ids) != data['total_skills']:
        raise ValueError('invalid registry count or duplicate skill IDs')
    entries = [(SOURCE / 'skills' / sid / 'SKILL.md',
                router / 'references/skills' / sid / 'SKILL.md') for sid in ids]
    entries.extend([(SOURCE / 'registry.json', router / 'references/registry.json'),
                    (SOURCE / 'LICENSE', router / 'references/LICENSE'),
                    (SOURCE / 'docs/RU_LOCALIZATION.md', router / 'references/RU_LOCALIZATION.md')])
    template = HERE / 'education-skills-routing'
    entries.extend((p, router / p.relative_to(template))
                   for p in template.rglob('*') if p.is_file() and '__pycache__' not in p.parts)
    return entries


def FINISH(home, entries):
    # Installation receipts deliberately remain local, outside the public skill references.
    manifest = {str(dst.relative_to(home)): digest(dst) for _, dst in entries}
    (home / 'education-hermes-install-manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')


if __name__ == '__main__':
    main()
