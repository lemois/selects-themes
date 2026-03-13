# selects-themes

Theme definitions for three product domains.

## Documentation map
- `README.md`: canonical repository contract and quick reference.
- `AGENTS.md`: agent-specific routing and context-minimization rules.
- `.agents/skills/selects-cli/SKILL.md`: workflow for the `selects` CLI bridge.
- `.agents/skills/selects-gift-sdk/SKILL.md`: workflow for SDK-backed theme HTML.
- `.agents/skills/*/references/*`: long-form references; open only on demand.

## Directory structure
- `themes/web`: themes for online catalog gifts
- `themes/card`: themes for item card sets
- `themes/package`: themes for packaging such as sleeves

Each direct child directory under `themes/web` / `themes/card` / `themes/package` is treated as a theme directory.

## Theme directory contract
- `index.html` is required.
- `meta.json` is required.
- `schema.json` is optional.
- `catalog-items/[id].html` is required (reserved page for product detail).
- You can add any other `.html` pages as needed.
- Every HTML file in a theme directory must load the SDK script:

```html
<script src="https://selects.gift/sdk/v1.js" defer></script>
<script src="./assets/alpine-start.js" defer></script>
```

- When `runtime-env.js` is present, load it before the SDK:

```html
<script src="./runtime-env.js" defer></script>
<script src="https://selects.gift/sdk/v1.js" defer></script>
<script src="./assets/alpine-start.js" defer></script>
```

- After the SDK script loads, theme code must call `window.Alpine.start()` directly.
- In normal theme work, do not add a separate Alpine import; the SDK exposes `window.Alpine`.

- Local file references inside a theme directory must always use relative paths, whether they appear in HTML, CSS, or JS.
- Reference local assets using paths relative to the current page. For example, `catalog-items/[id].html` can use `../assets/...` and `../runtime-env.js`.
- Files above the theme directory cannot be referenced, so every referenced file must live under that theme.
- Shared pages must resolve all of their own asset references through `./assets` in the same directory as the page itself.
- This also applies to references inside CSS and JS: shared pages must not use parent-directory references such as `../assets`.
- Shared pages are expected to be consumed by symlinking the entire directory that contains them.
- During deploy, `aws s3 sync` uploads symlinks as file contents, so links are not preserved as links on R2.
- Links should be written without `.html` because the server resolves the extension.
- There is currently no explicit repository rule that distinguishes `../index` from `../` for returning to a directory index; prefer directory-style links such as `./` and `../`.

Examples:

```html
<!-- index.html -->
<link rel="stylesheet" href="./assets/style.css" />
<script src="./runtime-env.js" defer></script>
<script src="https://selects.gift/sdk/v1.js" defer></script>
<script src="./assets/alpine-start.js" defer></script>
```

```html
<!-- catalog-items/[id].html -->
<link rel="stylesheet" href="../assets/style.css" />
<script src="../runtime-env.js" defer></script>
<script src="https://selects.gift/sdk/v1.js" defer></script>
<script src="../assets/alpine-start.js" defer></script>
```

```html
<!-- catalog-items/[id].html used as a shared page -->
<link rel="stylesheet" href="./assets/style.css" />
<script src="../runtime-env.js" defer></script>
<script src="https://selects.gift/sdk/v1.js" defer></script>
<script src="./assets/alpine-start.js" defer></script>
```

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
- Supported widgets:
  - `file-picker`
  - `color-picker`
  - `textarea`
- Widget options should be nested under `x-ui.options`.
- `file-picker` options follow the examples below and accept MIME types via `x-ui.options.accept`.
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
- Theme bootstrap code that already auto-runs on page load must not also be invoked from HTML with `x-init="init()"` or similar manual `init()` calls.
- `params` may omit properties when runtime values are unset, so theme templates must access param values defensively via Alpine's `$data` object, for example `x-show="$data.heroImage"` or `x-text="$data.message ?? ''"`.

## Validation
Run all checks:

```bash
npm run check
```

## Deploy to Cloudflare R2
Pushes to `main` trigger GitHub Actions (`.github/workflows/ci.yml`) to sync to R2.
Sync runs in two phases: `upload/update`, then `delete`.

Repository source paths:
- `themes/web/`
- `themes/card/`
- `themes/package/`

R2 destination paths:
- `web/`
- `card/`
- `package/`

Required GitHub Secrets:
- `R2_ACCOUNT_ID`
- `R2_BUCKET`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
