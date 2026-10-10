# hello-static

The smallest real PWFabric app: two pages, a navigation bar between them and
one theme. No data, no sign-in, no code of its own. Everything on the page
comes from the foundation pack.

## What is in it

```text
pwpack.json                        id, version, entry page, page order, the foundation pin
app/plan.json                      what the app is for and which pages it has
app/surfaces/home.receipt.json     the Home page: a heading, a link and a button, three cards
app/surfaces/about.receipt.json    the About page: how the app is made, in three cards
app/definitions/navigation.json    the top bar's links (`navbar.links`)
app/definitions/appearance.json    which theme to use (theme-zinc, light)
```

A page is a **receipt**: a tree of blocks, each with a `type` (a block the
foundation provides) and its `props`. Nothing else describes the page.

Both pages share one shell, the foundation's top-bar layout: a `navbar`, the
page, and a footer line. The navbar's own `links` are left empty; the runner
fills them from `navigation.json`, so the two pages always show the same
links. Links between pages are `link` blocks with a path (`/about`); the
foundation's `button` takes a full address and is used for the GitHub link.

## Run it

```sh
pwf add <foundation.pwpack>   # install the foundation this app pins (see ../README.md)
pwf validate              # check the folder and its pins
pwf dev                   # serve it locally and reload on change
```

With `pwf dev` running, edit a `content` prop in
`app/surfaces/home.receipt.json` and save: the page reloads with the new text.
Add a third link under `navbar.links` in `navigation.json` and the top bar
changes on both pages.

## Build and serve the result

```sh
pwf build                 # writes the runnable app to .pwf/out/
pwf run .pwf/out          # serves it at http://127.0.0.1:4700/
```

`.pwf/out/` is a **pwapp**: a static folder (`index.html`, the runner, one
bundle per block type, the app's JSON). Copy it to any static file host and
it runs there the same way.

`pwf pack` writes `hello-static-1.0.0.pwpack`, the deterministic archive of
this folder: the form you hand to someone else, or import into another tool.
