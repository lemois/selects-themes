---
name: selects-gift-sdk
description: Use this skill when building or updating Selects theme HTML that relies on the Selects Gift SDK. It explains the available Alpine data objects, the required template patterns, and how to load the long SDK spec only on demand.
---

# Selects Gift SDK

Use this skill for theme work that consumes the Selects Gift SDK already loaded by:

```html
<script src="https://selects.gift/sdk/v1.js" defer></script>
```

`runtime-env.js` may be present before the SDK, but its runtime variable details are out of scope for this repository's theme work.

## When to use

- The user edits `index.html`, `catalog-items.html`, or another theme HTML page.
- The template uses `x-data="params"`, `x-data="items"`, or `x-data="itemDetail"`.
- The task depends on loading states, error states, retry behavior, image URL generation, or variant selection behavior.
- The user mentions the Selects Gift SDK or asks how the SDK behaves in themes.

## Workflow

1. Read the short summary in `references/sdk-summary.md`.
2. Apply the summary to the current theme task.
3. Open `references/selects-gift-sdk-v1.md` only if exact SDK behavior or edge cases need confirmation.
4. After reading the full spec, keep only the task-relevant constraints in working memory and continue from the summary, not from the full document.

## Core rules

- Every theme HTML file must load the SDK script.
- Do not add a separate Alpine import unless platform constraints explicitly require it.
- `params` is synchronous and resolves to runtime params or an empty object.
- `items` and `itemDetail` are asynchronous data sources; always render `loading`, `error`, and success states separately.
- Use `createImageUrl(path)` from SDK data objects for item image URLs.
- `itemDetail.selectedProduct` can stay `undefined` for variant products until all required variations are selected.
- `itemDetail` depends on the catalog item detail URL contract described in the full spec.

## References

- Summary: `references/sdk-summary.md`
- Full spec: `references/selects-gift-sdk-v1.md`
