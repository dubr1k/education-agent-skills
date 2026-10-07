#!/usr/bin/env python3
"""Search the bundled education skill registry without loading all skills."""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REGISTRY = ROOT / "references" / "registry.json"


def terms(text: str) -> set[str]:
    raw = {t for t in re.findall(r"[\w-]+", text.casefold()) if len(t) > 1}
    # Compact RU→EN concept expansion for catalog discovery. The full skill
    # documents remain bilingual; this map only bridges common routing terms.
    aliases = {
        "учебн": {"learning", "curriculum"}, "обучен": {"learning", "instruction"},
        "урок": {"lesson", "instruction"}, "модул": {"unit", "curriculum"},
        "программ": {"curriculum", "sequence"}, "оценив": {"assessment"},
        "рубри": {"rubric"}, "критическ": {"critical", "thinking"},
        "мышлен": {"thinking"}, "памят": {"memory"}, "извлечен": {"retrieval"},
        "интервал": {"spacing", "spaced"}, "обратн": {"backwards"},
        "дизайн": {"design", "designer"}, "инклюз": {"inclusive", "udl"},
        "мотивац": {"motivation"}, "благополуч": {"wellbeing"},
        "саморегуляц": {"self-regulated", "metacognitive"},
        "историческ": {"historical", "history"}, "дискусс": {"discussion"},
        "вопрос": {"question", "questioning"}, "обратная": {"feedback"},
        "связь": {"alignment"}, "цель": {"outcomes", "targets"},
        "ии": {"ai"}, "грамотност": {"literacy"}, "учител": {"teacher"},
    }
    expanded = set(raw)
    for token in raw:
        for stem, additions in aliases.items():
            if token.startswith(stem):
                expanded.update(additions)
    return expanded


def score_skill(skill: dict, query_terms: set[str]) -> int:
    fields = [
        skill.get("id", ""),
        skill.get("name", ""),
        skill.get("display_name", ""),
        skill.get("domain", ""),
        skill.get("description", ""),
        " ".join(skill.get("tags") or []),
    ]
    text = " ".join(str(v) for v in fields).casefold()
    tokens = terms(text)
    score = 0
    for term in query_terms:
        if term in tokens:
            score += 5
        elif term in text:
            score += 2
    return score


def main() -> int:
    parser = argparse.ArgumentParser(description="Search 165 bundled education skills")
    parser.add_argument("query", help="Russian or English task terms")
    parser.add_argument("--limit", type=int, default=10)
    parser.add_argument("--domain", default=None)
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()

    data = json.loads(REGISTRY.read_text(encoding="utf-8"))
    q = terms(args.query)
    ranked = []
    for skill in data.get("skills", []):
        if args.domain and skill.get("domain") != args.domain:
            continue
        score = score_skill(skill, q)
        if score:
            skill_id = skill["id"]
            ranked.append({
                "score": score,
                "skill_id": skill_id,
                "name": skill.get("name"),
                "domain": skill.get("domain"),
                "description": skill.get("description"),
                "evidence_strength": skill.get("evidence_strength"),
                "path": f"references/skills/{skill_id}/SKILL.md",
                "chains_well_with": skill.get("chains_well_with") or [],
            })
    ranked.sort(key=lambda x: (-x["score"], x["skill_id"]))
    ranked = ranked[: max(1, args.limit)]

    if args.json:
        print(json.dumps(ranked, ensure_ascii=False, indent=2))
    else:
        for item in ranked:
            print(f"{item['score']:>3}  {item['skill_id']}  [{item.get('evidence_strength') or 'n/a'}]")
            print(f"     {item['description']}")
            print(f"     path: {item['path']}")
    return 0 if ranked else 1


if __name__ == "__main__":
    raise SystemExit(main())
