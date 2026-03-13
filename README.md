# selects-themes

Theme definitions for three product domains.

## Documentation map
- `README.md`: canonical repository contract and quick reference.
- `AGENTS.md`: agent-specific routing and context-minimization rules.
- `.agents/skills/selects-cli/SKILL.md`: workflow for the `selects` CLI bridge.
- `.agents/skills/selects-gift-sdk/SKILL.md`: workflow for SDK-backed theme HTML.
- `.agents/skills/*/references/*`: long-form references; open only on demand.

## Directory structure
- `themes/web`: オンラインカタログギフト用テーマ
- `themes/card`: アイテムカードセット用テーマ
- `themes/package`: スリーブなどの包装用テーマ

Each direct child directory under `themes/web` / `themes/card` / `themes/package` is treated as a theme directory.

## Theme directory contract
- `index.html` is required.
- `meta.json` is required.
- `schema.json` is optional.
- `catalog-items.html` is optional (reserved page for product detail).
- You can add any other `.html` pages as needed.
- Every HTML file in a theme directory must load the SDK script:

```html
<script src="https://selects.gift/sdk/v1.js" defer></script>
```

- When `runtime-env.js` is present, load it before the SDK:

```html
<script src="./runtime-env.js" defer></script>
<script src="https://selects.gift/sdk/v1.js" defer></script>
```

- Do not add a separate Alpine import unless platform constraints explicitly require it.
- Links should be written without `.html` because the server resolves the extension.
- If theme-specific assets are needed, place them in `assets/` under the same theme directory.

Minimal shape:

```text
themes/<domain>/<theme>/
  index.html
  meta.json
  catalog-items.html  # optional
  schema.json         # optional
  assets/             # optional
```

## JSON schema rules
- `meta.json` is validated by `schemas/meta.schema.json`.
- `schemas/meta.schema.json` uses JSON Schema draft-07.
- `schema.json` (if present) must be a valid JSON Schema and must explicitly declare draft-07:

```json
"$schema": "http://json-schema.org/draft-07/schema#"
```

- Write `schema.json` in a plain, inline form that the UI can interpret reliably.
- Do not use tuple-style arrays such as `type: "array"` with `items: [...]` because the UI cannot interpret positional item schemas.
- Do not use indirection such as `$ref`, `definitions`, or overly nested composition because the UI may not interpret them correctly.
- UI metadata for schema fields should use `x-ui`.
- Widget type should be written as `x-ui.widget`.
- Widget options should be nested under `x-ui.options`.
- `x-ui.options.accept` can be either a string or an array of strings when multiple file patterns are needed.

Example:

```json
"heroImage": {
  "type": "string",
  "x-ui": {
    "widget": "file-picker",
    "options": {
      "accept": "image/*"
    }
  }
}
```

Multiple patterns:

```json
"heroImage": {
  "type": "string",
  "x-ui": {
    "widget": "file-picker",
    "options": {
      "accept": ["image/*", ".webp"]
    }
  }
}
```

## Selects CLI bridge
- `selects` is the authoritative bridge to the local design app.
- Always run `selects` with no arguments first and treat the returned help schema as the source of truth for supported commands, payloads, and examples.
- `selects` reads a JSON request from stdin and writes a JSON response to stdout.
- The help output defines the CLI envelope only. For `design.params`, use the matched theme directory's `schema.json` as the source of truth when it exists.
- Resolve theme directories from `design.type` and the returned theme identifier:
  - `web` -> `themes/web/<theme>`
  - `card` -> `themes/card/<theme>`
  - `package` -> `themes/package/<theme>`
- If the design app is not running, treat that as an environment precondition rather than a theme bug.

Common pattern:

```sh
selects
printf '%s\n' '<request-json-from-help-schema>' | selects
```

Use `.agents/skills/selects-cli/SKILL.md` when the task depends on active design state or `selects` request construction.

## SDK docs
- The canonical SDK spec is `.agents/skills/selects-gift-sdk/references/selects-gift-sdk-v1.md`.
- Read `.agents/skills/selects-gift-sdk/SKILL.md` first.
- Use `.agents/skills/selects-gift-sdk/references/sdk-summary.md` as the default SDK reference.
- Open the full spec only when exact behavior, URL contracts, or edge cases matter.

## Validation
Run all checks:

```bash
npm run check
```

## Deploy to Cloudflare R2
`main` への `push` 時に GitHub Actions (`.github/workflows/ci.yml`) から R2 に同期します。
同期は 2 フェーズです（1: upload/update, 2: delete）。

同期対象:
- `themes/web/`
- `themes/card/`
- `themes/package/`

必要な GitHub Secrets:
- `R2_ACCOUNT_ID`
- `R2_BUCKET`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
