# Repository Instructions

## Directory purpose
- `themes/web`: online catalog gift themes.
- `themes/card`: item card set themes.
- `themes/package`: packaging themes (sleeves, wrapping, etc.).

## Theme directory rules
- Each direct child directory under `themes/web` / `themes/card` / `themes/package` is a theme directory.
- `index.html` is required in every theme directory.
- `meta.json` is required in every theme directory.
- `schema.json` is optional in each theme directory.
- `catalog-items.html` is optional and reserved for product detail pages.
- Arbitrary extra `.html` pages are allowed.
- Every HTML file in a theme directory must load the SDK script:
  - `<script src="https://selects.gift/sdk/v1.js" defer></script>`
- Load `runtime-env.js` before the SDK when present (example):
  - `<script src="./runtime-env.js" defer></script>`
  - `<script src="https://selects.gift/sdk/v1.js" defer></script>`
- The SDK internally uses `alpine.js`; do not add a separate Alpine import unless explicitly required by platform constraints.
- Links should omit `.html`; the server resolves it.
- If assets are needed, place them under `assets/` inside the theme directory.
- Recommended minimal shape:
  - `<root>/themes/<domain>/<theme>/index.html`
  - `<root>/themes/<domain>/<theme>/meta.json`
  - `<root>/themes/<domain>/<theme>/catalog-items.html` (optional)
  - `<root>/themes/<domain>/<theme>/schema.json` (optional)
  - `<root>/themes/<domain>/<theme>/assets/` (optional)

## JSON schema conventions
- `meta.json` must be validated against `schemas/meta.schema.json`.
- `schemas/meta.schema.json` uses JSON Schema draft-07.
- `schema.json` (when present) must explicitly declare draft-07:
  - `"$schema": "http://json-schema.org/draft-07/schema#"`
- Write `schema.json` in a plain, inline form that the UI can interpret reliably.
- Do not use tuple-style arrays such as `type: "array"` with `items: [...]` because the UI cannot interpret positional item schemas.
- Do not use indirection such as `$ref`, `definitions`, or overly nested composition because the UI may not interpret them correctly.
- UI metadata for schema fields should use `x-ui`.
- Widget type should be written as `x-ui.widget`.
- Widget options should be nested under `x-ui.options`.
- New or updated `schema.json` files must remain compatible with draft-07.

## Selects CLI bridge
- Theme development should treat `selects` as the primary bridge to the design app.
- Start by running `selects` with no arguments to retrieve the current request JSON Schema help.
- `selects` reads a JSON request from stdin and writes a JSON response to stdout.
- Do not hardcode supported commands in instructions because the bridge will be extended over time.
- Treat the schema returned by the no-argument `selects` invocation as the authoritative source for supported commands, payload shapes, and examples.
- Treat `selects` design resources as linked to the themes in this repository. Resolve the theme domain from `design.type`, then combine that domain with the theme identifier to find the corresponding theme directory under `themes/web`, `themes/card`, or `themes/package`.
- For fields inside `design.params`, use the matched theme directory's `schema.json` as the source of truth when that file exists.
- The `selects` help schema defines the CLI request envelope and command payload shapes. Theme-specific parameter fields are defined by each theme's `schema.json`, not by the CLI help output.
- Build stdin JSON requests only after reading that schema for the current environment.
- Prefer the command exposed by that schema for retrieving the active design when theme work depends on the currently open design.
- If the design app is not running, `selects` does not work. Treat that as an environment precondition, not a theme bug.
- Keep stdin JSON compact and valid against the help schema returned by `selects`.
- Example invocations:
  - `selects`
  - `printf '%s\n' '<request-json-from-help-schema>' | selects`

## Local skills
### Available skills
- `selects-cli`: Workflow for using the `selects` CLI bridge during theme development. Read `/Users/usp/repositories/selects-themes/docs/skills/selects-cli/SKILL.md`.

### Skill trigger
- Use `selects-cli` whenever a task involves inspecting the current design app state, fetching active designs, listing designs, or deriving theme work from design data exposed through `selects`.
