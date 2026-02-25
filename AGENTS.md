# Repository Instructions

## Directory purpose
- `web`: online catalog gift themes.
- `card`: item card set themes.
- `package`: packaging themes (sleeves, wrapping, etc.).

## Theme directory rules
- Each direct child directory under `web` / `card` / `package` is a theme directory.
- `index.html` is required in every theme directory.
- `meta.json` is required in every theme directory.
- `schema.json` is optional in each theme directory.
- `catalog-items.html` is optional and reserved for product detail pages.
- Arbitrary extra `.html` pages are allowed.
- Links should omit `.html`; the server resolves it.
- If assets are needed, place them under `assets/` inside the theme directory.
- Recommended minimal shape:
  - `<root>/<domain>/<theme>/index.html`
  - `<root>/<domain>/<theme>/meta.json`
  - `<root>/<domain>/<theme>/catalog-items.html` (optional)
  - `<root>/<domain>/<theme>/schema.json` (optional)
  - `<root>/<domain>/<theme>/assets/` (optional)

## JSON schema conventions
- `meta.json` must be validated against `schemas/meta.schema.json`.
- `schemas/meta.schema.json` uses JSON Schema draft-07.
- `schema.json` (when present) must explicitly declare draft-07:
  - `"$schema": "http://json-schema.org/draft-07/schema#"`
- New or updated `schema.json` files must remain compatible with draft-07.
