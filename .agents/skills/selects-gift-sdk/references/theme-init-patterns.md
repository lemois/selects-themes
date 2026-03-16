# Theme Init Patterns

Use this reference when a Selects Gift SDK theme needs one-shot initialization that depends on SDK Alpine data such as `params` or `itemDetail`.

## Standard pattern

Prefer this pattern for theme-local initialization:

```html
<div x-data="params" x-init="window.selectsInit($el, $data)" x-cloak>
  ...
</div>
```

```js
(() => {
  window.selectsInit = (root, data) => {
    // theme-specific initialization
  };

  window.Alpine.start();
})();
```

## Why this pattern

- It avoids direct reads from `window.SELECTS_GIFT_RUNTIME_ENV`.
- It initializes from Alpine-managed SDK data instead of re-reading runtime globals.
- It keeps the HTML surface small.
- It works even when the SDK Alpine data object is only available in Alpine expressions, not as a plain JS function such as `params()`.

## Naming

- Use `window.selectsInit` as the standard global entrypoint for page-local initialization.
- Keep the implementation page-local by defining it in the theme script loaded by that page.
- Do not introduce generic names such as `window.init` or `window.setup`.

## Scope

- Use one `window.selectsInit` per loaded page theme script.
- It is acceptable for `index.html` and `catalog-items/[id].html` to each define their own `window.selectsInit` in different files when those files are not loaded together.

## Loading order

- Load `runtime-env.js` first when present.
- Load the SDK script next.
- Load the page's theme script after the SDK.
- Call `window.Alpine.start()` from the page's theme script after registering `window.selectsInit` and any other custom Alpine behavior.

## Avoid

- Do not read `window.SELECTS_GIFT_RUNTIME_ENV` directly from theme initialization code.
- Do not add a dedicated `alpine-start.js` helper just to call `window.Alpine.start()`.
- Do not use `x-effect` for one-shot bootstrap when `x-init` is sufficient.
- Do not add dummy child elements only to trigger initialization.
