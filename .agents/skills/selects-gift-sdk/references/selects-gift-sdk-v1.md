# selects-gift-sdk v1 User Guide

This document describes the public behavior of `selects-gift-sdk` v1 for theme developers.
It is written for **SDK users** (template and theme implementers), not SDK maintainers.

---

## 1. Purpose

`selects-gift-sdk` v1 bootstraps Alpine.js data objects that theme templates can consume.

After loading the SDK script, these Alpine data objects are available:

- `params`
- `items`
- `item`
- `itemDetail`
- `utils`

---

## 2. Runtime requirement

Before the SDK script is executed, `window.SELECTS_GIFT_RUNTIME_ENV` must be defined.

### Required fields

- `graphqlEndpoint: string`
- `imageBaseUrl: string`
- `resource: { type: string; id: string }`

### Optional fields

- `params: Record<string, unknown>`

### Example

```html
<script>
  window.SELECTS_GIFT_RUNTIME_ENV = {
    graphqlEndpoint: "https://example.com/graphql",
    imageBaseUrl: "https://cdn.example.com",
    resource: {
      type: "gift_catalog",
      id: "catalog-1",
    },
    params: {
      locale: "en",
    },
  };
</script>
<script src="/path/to/selects-gift-sdk/v1.js"></script>
<script>
  window.Alpine.start();
</script>
```

If `window.SELECTS_GIFT_RUNTIME_ENV` is missing, SDK initialization fails.

---

## 3. Global behavior

- The SDK registers Alpine data on `window.Alpine`.
- Theme code must call `window.Alpine.start()` after registering any custom Alpine data.
- You can use Alpine data directly in templates via `x-data`.
- Network requests are performed internally by the SDK.

---

## 4. `params` data

`params` exposes values from `window.SELECTS_GIFT_RUNTIME_ENV.params`.

### Usage

```html
<div x-data="params">
  <p x-text="$data.locale ?? ''"></p>
</div>
```

### Notes

- `params` has no `loading`, `error`, or `fetch` lifecycle.
- If runtime `params` is not provided, `params` resolves to an empty object.
- Individual param properties may be absent when runtime values are unset.
- Access param values defensively via `$data.<key>` in Alpine expressions.

---

## 5. `items` data

`items` retrieves catalog item lists and groups them by section.

### State

- `loading: boolean`
- `error?: { message: string; isRetryable: boolean }`
- `data?: { count: number; items: GiftCatalogItem[] }`
- `sections: Record<string, GiftCatalogItem[]>` (derived from `data.items`)
- `createImageUrl(path, size?)` (image URL helper)
  - `size`: `"thumbnail"` | `"zoom"`

### Methods

- `fetch()`
  - Manually retries loading catalog items (for example, from a Retry button).

### Minimal template example

```html
<div x-data="items">
  <template x-if="loading">
    <p>Loading...</p>
  </template>

  <template x-if="error">
    <div>
      <p x-text="error.message"></p>
      <button type="button" x-show="error.isRetryable" @click="fetch()">
        Retry
      </button>
    </div>
  </template>

  <template x-if="data">
    <div>
      <p>Total items: <span x-text="data.count"></span></p>

      <template
        x-for="(sectionItems, sectionName) in sections"
        :key="sectionName"
      >
        <section>
          <h2 x-text="sectionName"></h2>
          <template x-for="item in sectionItems" :key="item.id">
            <article>
              <h3 x-text="item.name"></h3>
            </article>
          </template>
        </section>
      </template>
    </div>
  </template>
</div>
```

---

## 6. `item` data

`item` retrieves a single catalog item by its alias.

### Usage

```html
<div x-data="item('some-alias')">
```

The `alias` argument is required. If the value is not a string, `error` is set immediately with an invalid-alias message.

### Batching behavior

When multiple `item` instances are initialized in the same rendering pass, the SDK batches their requests into a single GraphQL query using `queueMicrotask`. This avoids N+1 requests when many `item` components appear on the same page.

### State

- `loading: boolean`
- `error?: { message: string; isRetryable: boolean }`
- `data?: GiftCatalogItem`
- `createImageUrl(path, size?)` (image URL helper)
  - `size`: `"thumbnail"` | `"zoom"`

### Methods

- `fetch()`
  - Manually retries loading the catalog item (for example, from a Retry button).

### Minimal template example

```html
<div x-data="item('some-alias')">
  <template x-if="loading">
    <p>Loading...</p>
  </template>

  <template x-if="error">
    <div>
      <p x-text="error.message"></p>
      <button type="button" x-show="error.isRetryable" @click="fetch()">
        Retry
      </button>
    </div>
  </template>

  <template x-if="data">
    <article>
      <h3 x-text="data.name"></h3>
      <p x-text="data.description"></p>
      <template x-for="img in data.catalogItemImages" :key="img.id">
        <img :src="createImageUrl(img.image)" />
      </template>
    </article>
  </template>
</div>
```

---

## 7. `itemDetail` data

`itemDetail` retrieves and manages one catalog item detail page.

### URL contract

`itemDetail` expects the page path format below:

- `/:resourceType/:resourceId/catalog-items/:catalogItemId`

If the path does not match this format, `error` is set and item detail cannot be fetched.

### State

- `loading: boolean`
- `error?: { message: string; isRetryable: boolean }`
- `data?: GiftCatalogItemDetail`
- `selectedVariationValues: Record<number, number | undefined>`
- `selectedProduct?: BaseProduct`
  - For variant products, this remains `undefined` until all required variations are selected.
- `createImageUrl(path, size?)` (image URL helper)
  - `size`: `"thumbnail"` | `"zoom"`

### Methods

- `fetch()`
  - Manually retries loading item detail (for example, from a Retry button).
- `updateVariationValue(variationId, variationValueId)`
  - Updates selected variation values for variant products.

### Selection behavior for variant products

- If the product type is not variant, `selectedProduct` points to the base product.
- If the product type is variant, `selectedProduct` is resolved only after all required variation values are selected.
- When a new item detail is loaded, selected variation state is reset.

### Minimal template example

```html
<div x-data="itemDetail">
  <template x-if="loading">
    <p>Loading...</p>
  </template>

  <template x-if="error">
    <div>
      <p x-text="error.message"></p>
      <button type="button" x-show="error.isRetryable" @click="fetch()">
        Retry
      </button>
    </div>
  </template>

  <template x-if="data">
    <section>
      <h1 x-text="data.name"></h1>
      <p x-text="data.description"></p>

      <template x-if="data.product.type === 'VARIANT'">
        <div>
          <template
            x-for="variation in data.product.current.productHistoryProductVariations"
            :key="variation.id"
          >
            <fieldset>
              <legend x-text="variation.productVariation.name"></legend>

              <template
                x-for="value in variation.productVariation.productVariationValues"
                :key="value.id"
              >
                <label>
                  <input
                    type="radio"
                    :name="`variation-${variation.productVariation.id}`"
                    :checked="selectedVariationValues[variation.productVariation.id] === value.id"
                    @change="updateVariationValue(variation.productVariation.id, value.id)"
                  />
                  <span x-text="value.name"></span>
                </label>
              </template>
            </fieldset>
          </template>
        </div>
      </template>

      <template x-if="selectedProduct">
        <p>Selected product ID: <span x-text="selectedProduct.id"></span></p>
      </template>
    </section>
  </template>
</div>
```

---

## 8. `utils` data

`utils` exposes small template helpers that do not need remote data fetching.

### Methods

- `backIfSameOrigin(event)`
  - Intended for `<a>` click handlers.
  - Works as a same-origin back helper.
  - If `document.referrer` is the same origin as the current page and browser history is available, calls `window.history.back()`.
  - Otherwise, allows the anchor's default navigation to continue.

### Recommended usage with `<a>`

Keep a real `href` for no-JavaScript fallback and SEO/crawlability, then intercept the click in Alpine.

```html
<a
  x-data="utils"
  href="../"
  @click="backIfSameOrigin"
>
  Back to list
</a>
```

### Notes

- This is intended for detail-to-list navigation where bfcache benefits are expected on `history.back()`.

---

## 9. Error handling guidance for theme developers

For robust theme UX:

- Always render `loading`, `error`, and success states separately.
- Avoid assuming `data` is always present.
- Avoid assuming `selectedProduct` exists for variant items before all selections are complete.

---

## 10. Type reference

This section documents the public data shapes that theme templates consume.
Types that are only used internally by the SDK (such as variant resolution internals) are omitted.

### Shared types

```ts
type ErrorState = {
  message: string;
  isRetryable: boolean;
};
```

### `items` / `item` data types

```ts
type GiftCatalogItem = {
  id: number;
  alias?: string | null;
  name: string;
  description: string;
  specification: string;
  commentImage?: string | null;
  commentTitle: string;
  commentBody: string;
  section: string;
  productId: number;
  catalogItemImages: Array<{
    id: number;
    image: string;
  }>;
};

type GiftCatalogItems = {
  count: number;
  items: GiftCatalogItem[];
};
```

### `itemDetail` data types

```ts
type GiftCatalogItemDetail = {
  id: number;
  alias?: string | null;
  name: string;
  description: string;
  specification: string;
  commentImage?: string | null;
  commentTitle: string;
  commentBody: string;
  section: string;
  catalogItemImages: Array<{
    id: number;
    image: string;
  }>;
  product: {
    id: number;
    status: string;
    type: string;
    current: {
      id: number;
      token: string;
      productHistoryProductVariations: Array<{
        id: number;
        productVariation: {
          id: number;
          name: string;
          productVariationValues: Array<{
            id: number;
            name: string;
          }>;
        };
      }>;
    };
  };
};
```

`selectedProduct` resolves to the following shape:

```ts
type SelectedProduct = {
  id: number;
  status: string;
  current: {
    id: number;
    token: string;
  };
};
```

---

## 11. Scope of this guide

This guide intentionally focuses on **public usage behavior** for SDK consumers.
It does not describe internal implementation, private closures, or internal GraphQL client details.
