---
name: selects-cli
description: Use this skill when working on Selects themes that depend on the local design app state or when the user mentions the selects CLI. It explains how to inspect the bridge schema, send JSON requests over stdin, and rely on the no-argument help output as the source of truth.
---

# Selects CLI

Use this skill for theme work that depends on design data from the local Selects design app.

## When to use

- The user asks to inspect the currently active design.
- The user wants to list or fetch designs from the design app.
- The user wants to preview a theme or see how a theme looks.
- The user wants to create or update a design in the design app.
- Theme implementation should follow a design that is open in the app.
- The user mentions `selects`.

## Workflow

1. Run `selects` with no arguments first.
2. Read the JSON Schema help returned on stdout.
3. Build a stdin JSON request that matches the schema.
4. Pipe the JSON into `selects`.
5. Parse the JSON response and use it as the source of truth for the current design app state.
6. When a design resource links to a theme, resolve the theme directory from `design.type` and the theme identifier, then read that theme's `schema.json` when present for `design.params`.

## Constraints

- The design app must be running. If it is not running, `selects` will not work.
- Treat the help schema from `selects` as authoritative.
- Keep requests minimal and schema-valid.
- When the task is tied to the current design, inspect the help output and use the active-design command defined there.
- **Never start your own dev server** (e.g. via `npx serve`, `python -m http.server`, or any other local server) to preview themes. Always use `selects` to obtain a preview URL from the design app.
- **Design creation and updates** must go through `selects`. Do not manually construct design data outside the CLI.

See `README.md` for the repository-level mapping between `design.type`, theme directories, and `schema.json`.
