# Docs Maintenance Heuristics

Use this file when the basic workflow in `SKILL.md` is not enough.

## Responsibility split

- `README.md`: human-facing overview, operations reference (deploy, validation, secrets). Not the primary source for agent-consumable rules.
- `AGENTS.md`: agent-only routing, context policy, and which local skills to use. Pure index.
- `.agents/skills/<name>/SKILL.md`: trigger conditions, rule summaries, minimal workflow, and when to open more detail.
- `.agents/skills/<name>/references/*`: detailed behavior, examples, edge cases, and long checklists.

## Single-source rules

- A rule should be explained fully in one place only.
- Secondary documents should summarize the rule in one line and point to the owner.
- If two files need the same detail repeatedly, move that detail into a shared canonical file instead of syncing copies.

## Context-optimization checks

- Remove repeated examples when one canonical example is enough.
- Avoid re-listing repository structure in both `README.md` and `AGENTS.md`.
- Avoid repeating SDK or CLI rules in both a skill summary and its reference.
- Prefer compact role labels such as "summary", "reference", or "canonical contract" over long explanatory paragraphs.
- Open long references only after the summary proves insufficient.

## Editing checklist

- Does each edited document have a single clear role?
- Can a future edit determine the owner of each rule quickly?
- Did any summary start restating detailed reference content?
- Did any skill start duplicating rules that another skill already owns?
- Is there a shorter pointer that preserves clarity?
