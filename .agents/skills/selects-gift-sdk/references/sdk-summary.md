# Selects Gift SDK v1 Summary

Use this file first. Open the full spec only when this summary is insufficient.

## Loading

- Theme HTML must load the SDK script.
- When `runtime-env.js` exists, load it before the SDK.
- Theme bootstrap code should live in the page's theme script such as `assets/theme.js`.
- After the SDK script loads, theme code must call `window.Alpine.start()` directly from that theme script.
- Theme-local file references must use relative paths.
- Local assets should be referenced relative to the current page.
- Do not add a separate Alpine import in normal theme work; the SDK exposes `window.Alpine`.

## Available Alpine data objects

- `params`
- `items`
- `itemDetail`
- `utils`

## Template rules

- Treat SDK-managed network access as internal; templates should only consume exposed state and methods.
- `runtime-env.js` may be loaded before the SDK, but the runtime variable contract itself does not need repository-specific handling here.
- When a theme needs initialization based on SDK Alpine data, prefer `x-init` with `window.selectsInit*` functions defined in the loaded page theme script.
- Use `window.selectsInit($el, $data)` for the first stage and split later stage work into names such as `window.selectsInitItems($el, $data)` when the DOM or data needed by that stage only exists after an `x-if` render and `$nextTick`.
- Do not combine that pattern with `x-init="init()"` or similar manual calls for bootstrap code that already auto-runs.

## `params`

- Exposes runtime `params`.
- No async lifecycle.
- Falls back to an empty object when params are absent.
- Individual param properties may be absent when runtime values are unset.
- In templates, access param values defensively via `$data.<key>` instead of assuming top-level properties exist.

## `items`

- Async catalog list data source.
- State: `loading`, `error`, `data`, derived `sections`.
- Method: `fetch()` for retry/manual reload.
- Helper: `createImageUrl(path, size?)`.
- Always render loading, error, and success states separately.

## `itemDetail`

- Async catalog item detail data source.
- State: `loading`, `error`, `data`, `selectedVariationValues`, `selectedProduct`.
- Methods: `fetch()`, `updateVariationValue(variationId, variationValueId)`.
- Helper: `createImageUrl(path, size?)`.
- Variant products require all required variation selections before `selectedProduct` resolves.
- Selection state resets when a new item detail is loaded.
- Depends on the catalog item detail URL contract from the full spec.

## `utils`

- Small synchronous template helpers with no remote fetch lifecycle.
- Method: `backIfSameOrigin(event)`.
- Use it on real anchors so same-origin back navigation can prefer `history.back()` and fall back to the anchor `href`.

## Escalate to full spec when

- The page path format for `itemDetail` matters.
- You need exact field names or method semantics.
- You need to confirm error or retry behavior precisely.
- You are adding a new theme pattern and want to verify public SDK guarantees.

## Context hygiene

- After reading the full spec, write down only the constraints needed for the current task.
- Do not keep or restate the entire specification when a short checklist is enough.
