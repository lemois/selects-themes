# Path Examples

## index.html

```html
<link rel="stylesheet" href="./assets/style.css" />
<script src="./runtime-env.js" defer></script>
<script src="https://selects.gift/sdk/v1.js" defer></script>
<script src="./assets/theme.js" defer></script>
```

## catalog-items/[id].html

```html
<link rel="stylesheet" href="../assets/style.css" />
<script src="../runtime-env.js" defer></script>
<script src="https://selects.gift/sdk/v1.js" defer></script>
<script src="../assets/theme.js" defer></script>
```

## catalog-items/[id].html used as a shared page

Shared pages are consumed by symlinking the entire directory. They must resolve assets through `./assets` in their own directory.

```html
<link rel="stylesheet" href="./assets/style.css" />
<script src="../runtime-env.js" defer></script>
<script src="https://selects.gift/sdk/v1.js" defer></script>
<script src="./assets/theme.js" defer></script>
```

## Symlink behavior

During deploy, `aws s3 sync` uploads symlinks as file contents, so links are not preserved as links on R2.
