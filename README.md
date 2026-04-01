# selects-themes

Theme definitions for three product domains.

## Directory structure
- `themes/web`: themes for online catalog gifts
- `themes/card`: themes for item card sets
- `themes/package`: themes for packaging such as sleeves

Each direct child directory under `themes/web/` / `themes/card/` / `themes/package/` is a theme directory.

## Theme directory contract

Required files:
- `index.html`
- `meta.json`
- `catalog-items/[id].html` (reserved page for product detail)

Optional files:
- `schema.json`
- additional `.html` pages

## Selects CLI bridge

`selects` is the authoritative bridge to the local design app. Run `selects` with no arguments to see available commands. It reads a JSON request from stdin and writes a JSON response to stdout.

## Validation

```bash
npm run check
```

## Deploy to Cloudflare R2

Pushes to `main` trigger GitHub Actions (`.github/workflows/ci.yml`) to sync to R2.

Repository source paths → R2 destination paths:
- `themes/web/` → `web/`
- `themes/card/` → `card/`
- `themes/package/` → `package/`

Required GitHub Secrets:
- `R2_ACCOUNT_ID`
- `R2_BUCKET`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
