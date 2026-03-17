# Repository Instructions

## Documentation map
- `README.md`: canonical repository contract and quick reference.
- `.agents/skills/*/SKILL.md`: task-specific workflow summaries. Read only when the task matches the skill trigger.
- `.agents/skills/*/references/*`: long-form references. Open only when the summary is insufficient.

## Context policy
- Prefer `README.md` over repeating repository rules here.
- Keep `SKILL.md` files short; move detailed behavior and examples into `references/`.
- When a summary and a reference both exist, read the summary first and open the reference only for exact behavior confirmation.
- For theme work, read `README.md` before opening skill-specific references.

## Skills
- Use `docs-maintenance` for tasks that reorganize repository docs, reduce duplication, or optimize documentation for lower context use.
- Use `selects-cli` for tasks that depend on the local design app state or the `selects` bridge.
- Use `selects-gift-sdk` for tasks that edit theme HTML consuming SDK data objects or SDK-specific behavior.
