"""Portable offline contracts; no live profile or network access."""
import importlib.util
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

HERE = Path(__file__).resolve().parents[1]
SOURCE = HERE.parents[1]
spec = importlib.util.spec_from_file_location('installer', HERE / 'install.py')
installer = importlib.util.module_from_spec(spec)
spec.loader.exec_module(installer)


class PackageTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.home = Path(self.tmp.name) / 'home'
        installer.install(self.home)

    def test_no_source_dependency_and_refuse_overwrite(self):
        with self.assertRaises(FileExistsError):
            installer.install(self.home)
        with self.assertRaises(ValueError):
            installer.install(SOURCE)
        with self.assertRaises(ValueError):
            installer.install(SOURCE / 'unsafe')
        with self.assertRaises(ValueError):
            installer.install(SOURCE.parent)

    def test_symlink_destinations_rejected_before_any_write(self):
        outside = Path(self.tmp.name) / 'outside'
        outside.mkdir()
        for rel in ['skills', 'skills/research', 'skills/education', 'skill-bundles']:
            with self.subTest(rel=rel):
                home = Path(self.tmp.name) / ('safe-' + rel.replace('/', '-'))
                home.mkdir()
                # Only parents used by this package can affect writes.
                if not any(home / rel == t or home / rel in t.parents for t in installer.TARGETS(home)):
                    continue
                link = home / rel
                link.parent.mkdir(parents=True, exist_ok=True)
                link.symlink_to(outside, target_is_directory=True)
                with self.assertRaises(ValueError):
                    installer.install(home)
                self.assertEqual(list(outside.iterdir()), [])
        home = Path(self.tmp.name) / 'dangling-home'
        home.mkdir()
        target = installer.TARGETS(home)[0]
        target.parent.mkdir(parents=True)
        target.symlink_to(outside / 'not-present')
        with self.assertRaises(ValueError):
            installer.install(home)
        self.assertFalse((outside / 'not-present').exists())

    def test_public_templates_have_no_private_machine_paths(self):
        for p in HERE.rglob('*'):
            if p.suffix not in {'.md', '.py'}:
                continue
            if p == Path(__file__):
                continue
            text = p.read_text()
            for forbidden in ['/Users/', '/root/', '/opt/anaconda', 'SOUL.md', 'ghp_', 'gho_']:
                self.assertNotIn(forbidden, text, str(p))


    def test_existing_receipt_is_not_overwritten(self):
        home = Path(self.tmp.name) / 'receipt-home'
        home.mkdir()
        receipt = home / 'education-hermes-install-manifest.json'
        receipt.write_text('existing receipt')
        with self.assertRaises(FileExistsError):
            installer.install(home)
        self.assertEqual(receipt.read_text(), 'existing receipt')
        self.assertFalse((home / 'skills').exists())

    def query(self, text, *extra):
        router = self.home / 'skills/education/education-skills-routing'
        result = subprocess.run([sys.executable, str(router / 'scripts/query_catalog.py'), text, '--json', *extra],
                                cwd=self.home, capture_output=True, text=True)
        return result, json.loads(result.stdout)

    def test_exact_library_hashes_and_localization(self):
        router = self.home / 'skills/education/education-skills-routing'
        data = json.loads((router / 'references/registry.json').read_text())
        self.assertEqual(len(data['skills']), 165)
        self.assertEqual(len({s['id'] for s in data['skills']}), 165)
        for skill in data['skills']:
            rel = Path(skill['id']) / 'SKILL.md'
            self.assertEqual((router / 'references/skills' / rel).read_bytes(), (SOURCE / 'skills' / rel).read_bytes())
        self.assertEqual(len(list((router / 'references/skills').rglob('SKILL.md'))), 165)
        for name, src in [('registry.json', 'registry.json'), ('LICENSE', 'LICENSE'), ('RU_LOCALIZATION.md', 'docs/RU_LOCALIZATION.md')]:
            self.assertEqual((router / 'references' / name).read_bytes(), (SOURCE / src).read_bytes())
        text = (router / 'SKILL.md').read_text()
        for boundary in ['Russian language alone does not determine country', 'Do not map “Year 9”',
                         'Do not infer ОВЗ', 'not the upstream MCP', 'evidence_strength', 'normally 1–3']:
            self.assertIn(boundary, text)

    def test_ru_en_queries_paths_and_domain_filter(self):
        for query in ['урок оценивание', 'retrieval practice', 'историческое мышление', 'инклюзивный дизайн',
                      'саморегуляция', 'AI literacy', 'мотивация', 'критическое мышление', 'rubric assessment']:
            with self.subTest(query=query):
                result, rows = self.query(query, '--limit', '5')
                self.assertEqual(result.returncode, 0, result.stderr)
                self.assertTrue(rows)
                self.assertLessEqual(len(rows), 5)
                for row in rows:
                    self.assertTrue((self.home / 'skills/education/education-skills-routing' / row['path']).is_file())
                    self.assertIn('evidence_strength', row)
        result, rows = self.query('critical thinking', '--domain', 'literacy-critical-thinking')
        self.assertEqual(result.returncode, 0)
        self.assertTrue(all(r['domain'] == 'literacy-critical-thinking' for r in rows))
        result, rows = self.query('zzzzzzzzzzzzzzzz')
        self.assertEqual(result.returncode, 1)
        self.assertEqual(rows, [])

    def test_flat_name_collisions_preserve_domain_qualified_identity(self):
        router = self.home / 'skills/education/education-skills-routing'
        skills = json.loads((router / 'references/registry.json').read_text())['skills']
        collisions = [s['id'] for s in skills if s['name'] == 'critical-thinking-task-designer']
        self.assertEqual(len(collisions), 2)
        self.assertEqual(len(set(collisions)), 2)
        for sid in collisions:
            self.assertTrue((router / 'references/skills' / sid / 'SKILL.md').is_file())


if __name__ == '__main__':
    unittest.main()
