# JSON Schema Rules

## General

- `schema.json` must be a valid JSON Schema and must declare draft-07:

```json
"$schema": "http://json-schema.org/draft-07/schema#"
```

- Write `schema.json` in a plain, inline form that the UI can interpret reliably.
- Do not use tuple-style arrays (`type: "array"` with `items: [...]`) because the UI cannot interpret positional item schemas.
- Do not use `$ref`, `definitions`, or overly nested composition because the UI may not interpret them correctly.

## x-ui widgets

UI metadata for schema fields uses `x-ui`. Widget type is `x-ui.widget`. Options are nested under `x-ui.options`.

Supported widgets:
- `file-picker`
- `color-picker`
- `textarea`

## file-picker

`x-ui.options.accept` takes a MIME type string or an array of strings.

Single pattern:

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
