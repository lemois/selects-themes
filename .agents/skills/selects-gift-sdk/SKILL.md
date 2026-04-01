---
name: selects-gift-sdk
description: Use this skill when building or updating Selects theme HTML that relies on the Selects Gift SDK. It explains the available Alpine data objects, the required template patterns, and how to load the long SDK spec only on demand.
---

# Selects Gift SDK

Use this skill for theme work that consumes the Selects Gift SDK in theme HTML.

## When to use

- The user edits `index.html`, `catalog-items/[id].html`, or another theme HTML page.
- The template uses `x-data="params"`, `x-data="items"`, or `x-data="itemDetail"`.
- The task depends on loading states, error states, retry behavior, image URL generation, or variant selection behavior.
- The user mentions the Selects Gift SDK or asks how the SDK behaves in themes.

## Workflow

1. Read the short summary in `references/sdk-summary.md`.
2. Apply the summary to the current theme task.
3. Open `references/selects-gift-sdk-v1.md` only if exact SDK behavior or edge cases need confirmation.
4. After reading the full spec, keep only the task-relevant constraints in working memory and continue from the summary, not from the full document.

## Constraints

- Theme directory structure, SDK script loading order, and path rules live in the `theme-authoring` skill.
- SDK usage rules live in `references/sdk-summary.md`.
- The standard theme-specific one-shot init pattern lives in `references/theme-init-patterns.md`.
- Prefer the summary over the full spec unless exact behavior matters.

## References

- Summary: `references/sdk-summary.md`
- Theme init patterns: `references/theme-init-patterns.md`
- Full spec: `references/selects-gift-sdk-v1.md`
