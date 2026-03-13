---
name: docs-maintenance
description: Use this skill when maintaining repository documentation, reducing duplication across README/AGENTS/skills, or optimizing document structure for lower context usage. It explains how to assign a single source of truth, keep SKILL files lean, and move detailed guidance into references.
---

# Docs Maintenance

Use this skill when editing repository docs, agent docs, or local skills in this repository.

## When to use

- The user asks to maintain or reorganize documentation.
- The task involves `README.md`, `AGENTS.md`, or `.agents/skills/*`.
- The goal includes reducing redundancy or context consumption.
- A new document or skill needs a clear home and responsibility boundary.

## Workflow

1. Read the documents directly involved in the task.
2. Map each file to one role: canonical contract, agent routing, task workflow, or detailed reference.
3. Remove duplicated rules from secondary documents and replace them with short pointers to the canonical source.
4. Keep `SKILL.md` focused on trigger conditions, workflow, and escalation points.
5. Move long examples, detailed rules, and edge-case behavior into `references/` when they are not needed on every trigger.
6. Re-read the edited docs to confirm the responsibility boundaries are still clear.

## Constraints

- Prefer one source of truth for each rule.
- Prefer short summaries plus references over repeated prose.
- Keep repository-wide rules in `README.md` unless they are agent-only instructions.
- Keep `AGENTS.md` focused on routing and context policy, not full repository restatement.
- Keep skill summaries brief and load detailed guidance only on demand.

## References

- Heuristics: `references/heuristics.md`
