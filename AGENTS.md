# Repository Instructions

## Directory structure
- `themes/web`: themes for online catalog gifts
- `themes/card`: themes for item card sets
- `themes/package`: themes for packaging such as sleeves

Each direct child directory under `themes/web/`, `themes/card/`, or `themes/package/` is a theme directory.

## Context policy
- `.agents/skills/*/SKILL.md`: task-specific workflow summaries. Read only when the task matches the skill trigger.
- `.agents/skills/*/references/*`: long-form references. Open only when the summary is insufficient.
- When a summary and a reference both exist, read the summary first and open the reference only for exact behavior confirmation.

## Skills
- Use `theme-authoring` when creating, editing, or structuring theme directories — including file layout, asset paths, `schema.json`, and `meta.json`.
- Use `selects-cli` when the task involves any of the following: previewing a theme, checking how a theme looks, inspecting the current design or its params, listing designs, creating or updating a design, or fetching catalog items. The `selects` CLI is the only way to interact with the local design app. **Never start a local dev server** (e.g. `npx serve`, `python -m http.server`) to preview themes — always use `selects` to obtain the preview URL.
- Use `selects-gift-sdk` for tasks that edit theme HTML consuming SDK data objects or SDK-specific behavior.
- Use `docs-maintenance` for tasks that reorganize repository docs, reduce duplication, or optimize documentation for lower context use.

## Deploy exclusion

Published themes are listed in `.deployignore` (one `domain/theme-name` per line) to exclude them from R2 sync. This file is required — `npm run check` fails if it is missing. **Always confirm with the user before removing entries from `.deployignore` (i.e., re-enabling deployment).**

## Validation

```bash
npm run check
```
