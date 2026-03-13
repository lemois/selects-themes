---
name: selects-cli
description: Use this skill when working on Selects themes that depend on the local design app state or when the user mentions the selects CLI. It explains how to inspect the bridge schema, send JSON requests over stdin, and rely on the no-argument help output as the source of truth.
---

# Selects CLI

Use this skill for theme work that depends on design data from the local Selects design app.

## When to use

- The user asks to inspect the currently active design.
- The user wants to list or fetch designs from the design app.
- Theme implementation should follow a design that is open in the app.
- The user mentions `selects`.

## Workflow

1. Run `selects` with no arguments first.
2. Read the JSON Schema help returned on stdout.
3. Build a stdin JSON request that matches the schema.
4. Pipe the JSON into `selects`.
5. Parse the JSON response and use it as the source of truth for the current design app state.
6. When a returned design resource includes `design.type` and a theme identifier, resolve the theme domain from `design.type` and use it with the theme identifier to find the matching theme directory in this repository.
7. Read that theme's `schema.json` when present to understand the valid fields for `design.params`.

## Request format

`selects` accepts a JSON object on stdin and writes JSON to stdout.

Do not rely on a hardcoded command list in this skill. The bridge is expected to grow, so the no-argument help output is the authoritative definition of supported commands, payloads, and examples for the current environment.

The help output only defines the CLI request envelope. For any `selects` design resource, the meaning and shape of theme-specific fields under `design.params` come from the linked theme's `schema.json` in this repository when that file exists.

## Common usage

Get the schema help:

```sh
selects
```

Send a request described by the current help schema:

```sh
printf '%s\n' '<request-json-from-help-schema>' | selects
```

## Constraints

- The design app must be running. If it is not running, `selects` will not work.
- Treat the help schema from `selects` as authoritative.
- Treat returned design resources as linked to this repository's theme directories, with the domain determined by `design.type`.
- Use the linked theme's `schema.json` as the source of truth for `design.params` fields when available.
- Keep requests minimal and schema-valid.
- When the task is tied to the current design, inspect the help output and use the active-design command defined there.
