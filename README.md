# selects-themes

Theme definitions for three product domains.

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
- Links should be written without `.html` because the server resolves the extension.
- If theme-specific assets are needed, place them in `assets/` under the same theme directory.

### Example tree

```text
.
├── themes/
│   ├── web/
│   │   └── <theme-name>/
│   │       ├── index.html
│   │       ├── meta.json
│   │       ├── catalog-items.html # optional (product detail page)
│   │       ├── about.html         # optional (arbitrary page)
│   │       ├── schema.json        # optional
│   │       └── assets/            # optional
│   ├── card/
│   │   └── <theme-name>/
│   │       ├── index.html
│   │       ├── meta.json
│   │       ├── catalog-items.html # optional
│   │       ├── schema.json        # optional
│   │       └── assets/            # optional
│   └── package/
│       └── <theme-name>/
│           ├── index.html
│           ├── meta.json
│           ├── catalog-items.html # optional
│           ├── schema.json        # optional
│           └── assets/            # optional
```

## JSON schema rules
- `meta.json` is validated by `schemas/meta.schema.json`.
- `schema.json` (if present) must be a valid JSON Schema.
- `schema.json` must explicitly declare draft-07:
  - `"$schema": "http://json-schema.org/draft-07/schema#"`
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
