# custom-block

An app that brings its own block. The page is made of the foundation's
blocks (a top bar, a heading, two cards, a button) and one `greeting` block
that is not in the foundation: it lives in this folder, under `atoms/`. It
uses the foundation's dark theme, `theme-midnight`.

## What is in it

```text
pwpack.json                                  the app and its foundation pin
app/surfaces/home.receipt.json               one page: the greeting in one card, foundation blocks in the other
app/definitions/navigation.json              the top bar's links
atoms/blocks/custom/greeting/component.tsx   the block's React component
atoms/blocks/custom/greeting/manifest.json   its identity and props
app/definitions/appearance.json              theme-midnight, dark
app/plan.json                                the one page and its purpose
```

The block is two files:

- **`manifest.json`** names the block (`id: "custom.greeting"`,
  `name: "greeting"`) and declares its props, `name` (string) and `emphasis`
  (boolean), with their defaults. The receipt refers to the block by its
  `name`: `"type": "greeting"`.
- **`component.tsx`** renders it. It receives `props` and `block`, and colours
  the text with the theme's primary colour (`var(--pw-color-primary)`), so it
  follows whichever theme the app uses.

## Run it

```sh
pwf add <foundation.pwpack>   # install the foundation this app pins (see ../README.md)
pwf validate              # the app's own atom is checked along with the pins
pwf dev                   # serve it; edit component.tsx and the page reloads
```

`pwf build` compiles the block into its own hash-pinned bundle next to the
foundation's blocks.

## Build and serve the result

```sh
pwf build                 # writes the runnable app to .pwf/out/
pwf run .pwf/out          # serves it at http://127.0.0.1:4700/
```

Try changing the block: add a third prop to `manifest.json` (for example a
`salutation` string defaulting to `"Hello"`), use it in `component.tsx`, set
it in `home.receipt.json`, and watch `pwf dev` rebuild.
