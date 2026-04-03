# Selects Gift SDK v1 Summary

Use this file first. Open the full spec only when this summary is insufficient.

## Loading

- Script loading order, bootstrap rules, and path rules live in the `theme-authoring` skill.
- The SDK exposes `window.Alpine`; do not add a separate Alpine import.

## Available Alpine data objects

- `params`
- `items`
- `item`
- `itemDetail`
- `utils`

## Template rules

- Treat SDK-managed network access as internal; templates should only consume exposed state and methods.
- `runtime-env.js` may be loaded before the SDK, but the runtime variable contract itself does not need repository-specific handling here.
- When a theme needs initialization based on SDK Alpine data, prefer `x-init` on the owning `x-data` element with `window.selectsInit*` functions defined in the loaded page theme script.
- Use `window.selectsInit($el, $data)` for the first stage and split later stage work into names such as `window.selectsInitItems(...)` when the DOM or data needed by that stage only exists after async data resolution or conditional render.
- Prefer `$watch('data', ...)` on the owning Alpine scope over placing `x-init` directly on nodes created by `x-if`.
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

## `item`

- Async single catalog item data source by alias.
- Usage: `x-data="item('some-alias')"`.
- State: `loading`, `error`, `data`.
- Method: `fetch()` for retry/manual reload.
- Helper: `createImageUrl(path, size?)`.
- Multiple `item` instances in the same rendering pass are batched into a single GraphQL query.

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
