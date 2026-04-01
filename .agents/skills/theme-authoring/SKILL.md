---
name: theme-authoring
description: Use this skill when creating, editing, or structuring Selects theme directories. It covers required files, path rules, SDK script loading order, bootstrap rules, and JSON schema authoring.
---

# Theme Authoring

Use this skill for tasks that involve the structure of a theme directory.

## When to use

- Creating a new theme directory.
- Adding, renaming, or moving files within a theme.
- Editing `schema.json` or `meta.json`.
- Fixing asset paths or link references in HTML, CSS, or JS.
- Reviewing whether a theme meets the directory contract.

## Theme directory contract

Each directory directly under `themes/web/`, `themes/card/`, or `themes/package/` is a theme.

Required files:
- `index.html`
- `meta.json`
- `catalog-items/[id].html`

Optional files:
- `schema.json`
- additional `.html` pages

Minimal shape:

```text
themes/<domain>/<theme>/
  index.html
  meta.json
  catalog-items/
    [id].html
    assets/           # optional
  schema.json         # optional
  assets/             # optional
```

## SDK script loading order

HTML that uses Selects Gift SDK data objects must load the SDK script. Purely static HTML does not need it.

```html
<script src="https://selects.gift/sdk/v1.js" defer></script>
<script src="./assets/theme.js" defer></script>
```

When `runtime-env.js` is present, load it before the SDK:

```html
<script src="./runtime-env.js" defer></script>
<script src="https://selects.gift/sdk/v1.js" defer></script>
<script src="./assets/theme.js" defer></script>
```

## Bootstrap rules

- Theme code must call `window.Alpine.start()` from the theme script.
- Do not add a separate Alpine import; the SDK exposes `window.Alpine`.
- For theme-specific init that depends on SDK Alpine data, use `x-init` on the owning `x-data` element with `window.selectsInit*` functions.

## Path rules

- All local file references must use relative paths.
- Reference assets relative to the current page (e.g. `catalog-items/[id].html` uses `../assets/`).
- Files above the theme directory cannot be referenced.
- Shared pages must resolve assets through `./assets` in their own directory, not `../assets`.
- Links should omit `.html` (the server resolves the extension).
- Prefer directory-style links (`./`, `../`) for directory indexes.

See `references/path-examples.md` for concrete examples.

## Constraints

- `meta.json` is validated by `schemas/meta.schema.json` (JSON Schema draft-07).
- `schema.json` must declare `"$schema": "http://json-schema.org/draft-07/schema#"`.
- See `references/json-schema-rules.md` for schema authoring rules and `x-ui` widget usage.

## References

- Path examples: `references/path-examples.md`
- JSON schema rules: `references/json-schema-rules.md`
