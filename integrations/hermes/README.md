# Portable Hermes integration

Source: https://github.com/dubr1k/education-agent-skills

This adapter preserves the repository's public source and license. It packages
methods for Hermes, not Claude/OpenCode/MCP execution. No installed profile,
provider, model, credentials, memory, cron, hooks or services are changed by tests.

## Install a reviewed checkout

Use Python 3.10+ and Git. First inspect the checkout and record `git rev-parse HEAD`.
Choose the actual active profile home; never fall back to another profile.
The destination must be outside the source checkout. Existing skill destinations
are refused, not overwritten: back up and review any existing installation first.

From the repository root, run via the Hermes `terminal` tool:

    python integrations/hermes/install.py --destination "$HERMES_HOME"

The destination is explicit and installation is opt-in. Tests instead install in
an isolated temporary home. Start a new Hermes session afterwards, use `skills_list`
and load the router with `skill_view`. Missing skills are a visible dependency
error, not permission to emulate methods or use an unrelated profile.

## Test

    python -m unittest discover -s integrations/hermes/tests -v

These offline tests exercise packaging and adapter contracts, not model compliance,
scientific validity, live screening accuracy or intervention effectiveness.
Receipts, backups and machine paths are generated locally, never committed here.

## Education layout and boundaries

The installer bundles all registry-selected skills under
`skills/education/education-skills-routing/references/skills/<domain>/<name>/SKILL.md`,
plus the exact registry, localization guide and source license. Only the router and
query adapter are new; upstream content, evidence strength and identifiers are unchanged.

Run `scripts/query_catalog.py` from the installed router directory (resolve it from
`skill_view`). Its RU→EN aliases are lightweight keyword discovery, not MCP semantic
ranking. Load each full reference by its exact domain-qualified ID. Choose 1–3 skills
and preserve input/output schemas and named evidence sources.

Russian language does not imply jurisdiction or grade equivalence. Do not equate
EAL/SEND/IEP with statutory Russian categories, infer diagnoses or declare ФГОС/ФОП
compliance without relevant current documents. The full upstream RU_LOCALIZATION.md
is bundled unmodified. No MCP server or plugin is installed by this adapter.

Upstream library verification: `python scripts/validate-skills.py`,
`python scripts/validate-registry.py`, and `npm ci && npm test`.
