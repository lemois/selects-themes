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
- Do not use indirection such as `$ref`, `definitions`, or overly nested composition because the UI may not interpret them correctly.
- UI metadata for schema fields should use `x-ui`.
- Widget type should be written as `x-ui.widget`.
- Widget options should be nested under `x-ui.options`.
- New or updated `schema.json` files must remain compatible with draft-07.
