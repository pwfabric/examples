# PWFabric examples

Two complete apps you can build and run with nothing but the `pwf` command
line: no account and no hosted service. Each folder is a **pwpack**, the
source form of a PWFabric app (`pwpack.json`, its pages and records under
`app/`, its own theme under `atoms/`, its pictures under `media/`), built from
the open [foundation and widgets packs](https://github.com/pwfabric/packs).

| App | The need it serves | Packs |
|---|---|---|
| [`cafe-menu`](cafe-menu/) | Example Café: the menu a guest opens from the QR code on the table. Dishes by category with diet tags, allergens and prices, and how to find the café. Reads the app's own records. | foundation |
| [`lighting-hub-waitlist`](lighting-hub-waitlist/) | Example Light: a lighting hub's website before launch. What it does, how it works, the kits, and a waitlist that writes a record. | foundation, widgets |

## Running one

The command line is on npm (Node 22 or newer). Download
`foundation-1.0.0.pwpack` (and `widgets-1.0.0.pwpack` for the lighting app)
from the [packs releases](https://github.com/pwfabric/packs/releases), then:

```sh
npm install -g @pwfabric/cli
cd cafe-menu
pwf add ../foundation-1.0.0.pwpack
pwf dev
```

`pwf add` copies the pack into the app's `.pwf/packs/` and checks it against
the content hash the app pins, so the app runs exactly against the pack it
was built with. `pwf dev` serves the app with its records and rebuilds on
change; `pwf build` writes the static app to `.pwf/out`, and
`pwf run .pwf/out` serves that. Pages are addressed as `/#/<page>`.

## What an example is

Each app serves one need for one kind of user, has only the pages that need
requires, wears one shell on every page, and has a name that says what it is
for. Its content agrees with itself across pages and its controls do what
they say. People, companies, products and places are fictional ("Example …").

- **The app writes every word.** Labels, empty states, errors and the
  not-found page come from the app (`plan.json` `messages` and its pages);
  the engine and the packs draw none of their own.
- **One identity.** Every page wears the app's own theme
  (`atoms/appearance/theme-<app>/`), with its own dark mode.
- **A page never fetches through a block.** Data arrives through a page's
  data sources; records live in `app/content/`, typed in
  `app/definitions/entities.json`, with access rules in
  `app/definitions/auth.json`.
- **Pictures are the app's own.** `media/` holds them and
  `media/provenance.json` records each one's source and licence.

## Checking them

```sh
node check.mjs --packs <folder with the .pwpack files>
```

For each app, in a temporary copy, `check.mjs` runs `pwf add` for every pack
the app requires, then `pwf validate` and `pwf build`, and fails unless each
exits 0. CI runs it against the packs built from
[pwfabric/packs](https://github.com/pwfabric/packs) and the published `pwf`.

## Licence

Apache License 2.0 ([`LICENSE`](LICENSE)), the apps' illustrations included.
