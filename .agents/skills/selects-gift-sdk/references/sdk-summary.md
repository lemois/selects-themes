# Selects Gift SDK v1 Summary

Use this file first. Open the full spec only when this summary is insufficient.

## Loading

- Theme HTML must load the SDK script.
- When `runtime-env.js` exists, load it before the SDK.
- Do not add a separate Alpine import in normal theme work.

## Available Alpine data objects

- `params`
- `items`
- `itemDetail`

## Template rules

- Treat SDK-managed network access as internal; templates should only consume exposed state and methods.
- `runtime-env.js` may be loaded before the SDK, but the runtime variable contract itself does not need repository-specific handling here.

## `params`

- Exposes runtime `params`.
- No async lifecycle.
- Falls back to an empty object when params are absent.

## `items`

- Async catalog list data source.
- State: `loading`, `error`, `data`, derived `sections`.
- Method: `fetch()` for retry/manual reload.
- Helper: `createImageUrl(path)`.
- Always render loading, error, and success states separately.

## `itemDetail`

- Async catalog item detail data source.
- State: `loading`, `error`, `data`, `selectedVariationValues`, `selectedProduct`.
- Methods: `fetch()`, `updateVariationValue(variationId, variationValueId)`.
- Helper: `createImageUrl(path)`.
- Variant products require all required variation selections before `selectedProduct` resolves.
- Selection state resets when a new item detail is loaded.
- Depends on the catalog item detail URL contract from the full spec.

## Escalate to full spec when

- The page path format for `itemDetail` matters.
- You need exact field names or method semantics.
- You need to confirm error or retry behavior precisely.
- You are adding a new theme pattern and want to verify public SDK guarantees.

## Context hygiene

- After reading the full spec, write down only the constraints needed for the current task.
- Do not keep or restate the entire specification when a short checklist is enough.
