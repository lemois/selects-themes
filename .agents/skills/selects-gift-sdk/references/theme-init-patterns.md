# Theme Init Patterns

Use this reference when a Selects Gift SDK theme needs initialization that depends on SDK Alpine data such as `params`, `items`, or `itemDetail`.

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

## Multi-stage pattern

When one page has setup that becomes valid at different Alpine lifecycle points, split the entrypoints by stage instead of forcing everything through one `x-init`.
Register the later stage from the owning `x-data` scope so the watcher and the rendered view stay close to the same Alpine state.

Typical split:

- `window.selectsInit(root, data)` for setup that can run as soon as the outer Alpine data object exists
- `window.selectsInitItems(root, data)` or another `window.selectsInit*` name for setup that depends on DOM created by `x-if`, `x-for`, or `$nextTick`

Example:

```html
<main data-page-root>
  <div
    x-data="params"
    x-init="window.selectsInit($el.closest('[data-page-root]'), $data)"
    x-cloak
  >
    ...

    <section
      x-data="items"
      x-init="$watch('data', (value) => value && $nextTick(() => window.selectsInitItems($el.closest('[data-page-root]'), $data)))"
    >
      <template x-if="data">
        <div>...</div>
      </template>
    </section>
  </div>
</main>
```

```js
(() => {
  window.selectsInit = (root, params) => {
    // setup that only needs params and stable outer DOM
  };

  window.selectsInitItems = (root, itemsData) => {
    // setup that needs rendered list/detail DOM
  };

  window.Alpine.start();
})();
```

## Why this pattern

- It avoids direct reads from `window.SELECTS_GIFT_RUNTIME_ENV`.
- It initializes from Alpine-managed SDK data instead of re-reading runtime globals.
- It keeps lifecycle wiring attached to the Alpine scope that owns the data.
- It works even when the SDK Alpine data object is only available in Alpine expressions, not as a plain JS function such as `params()`.
- It lets each initialization stage run only when its required data and DOM actually exist.

## Naming

- Use `window.selectsInit` as the standard global entrypoint for page-local initialization.
- When a page needs multiple timing-specific entrypoints, use `window.selectsInit*` names such as `window.selectsInitItems` or `window.selectsInitDetail`.
- Keep the implementation page-local by defining it in the theme script loaded by that page.
- Do not introduce generic names such as `window.init` or `window.setup`.

## Scope

- A page may expose one or more `window.selectsInit*` functions from its loaded theme script.
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
- Do not place DOM-dependent bootstrap directly on nodes created by `x-if` when the same timing can be expressed from the owning `x-data` scope with `$watch(...)+$nextTick`.
- Do not force DOM-dependent setup to run before the required `x-if` / `x-for` content exists; split it into a later `window.selectsInit*` stage instead.
