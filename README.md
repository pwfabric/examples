# PWFabric examples

Three small apps you can build and run with nothing but the `pwf` command
line: no account and no hosted service. Each folder is a complete **pwpack**,
the source form of a PWFabric app (`pwpack.json`, its pages under `app/`, and
any blocks of its own under `atoms/`).

| Example | What it shows |
|---|---|
| [`hello-static/`](hello-static/) | The smallest real app: two pages with a top bar between them, cards and links, one light theme. No data, no sign-in, no code. |
| [`custom-block/`](custom-block/) | An app that brings its own block (`atoms/blocks/custom/greeting/`) and uses it beside the foundation's blocks, in the dark theme. |
| [`members-data/`](members-data/) | An app with records and sign-in: an entity declaration, seed data in `app/data/`, a card per record, and the account control in the top bar. |

Each folder has its own `README.md` with the exact commands and what to look
at.

## The foundation pack

Every app stands on a **foundation pack**, the pack that supplies the blocks
(`navbar`, `heading`, `card`, `repeater`, …) and themes its pages use. It
lives in
[pwfabric/foundation](https://github.com/pwfabric/foundation).
Each example pins it twice in `pwpack.json`: `requires` says which range it
accepts (`@pwfabric/foundation` `^1.0.0`), and `packs[]` records the exact
build it was made against, by content hash.

Get the pack once, as `foundation-<version>.pwpack`: download it from the
foundation's GitHub releases, or build it in a clone (`pnpm install`, then
`node scripts/export-tgz.mjs --canonical`; it lands in `dist/`). Then install
it into an example before anything else. This copies it into the app's
`.pwf/packs/` cache, which `pwf validate`, `pwf dev` and `pwf build` read,
and re-pins the app to that exact build:

```sh
cd hello-static
pwf add /path/to/foundation-1.0.0.pwpack
```

For a new app of your own, pass the foundation when you create the app:

```sh
pwf create my-app --foundation /path/to/foundation-1.0.0.pwpack
```

or set `PWF_FOUNDATION` to that path once and leave the flag out.

## The commands

| Command | What it does |
|---|---|
| `pwf add <pack>` | Installs a pack (folder or `.pwpack`) into `.pwf/packs/` and pins it |
| `pwf validate` | Checks the folder and the packs it pins; exit 1 on any error |
| `pwf dev` | Serves the app locally and reloads it on every change |
| `pwf build` | Writes the runnable app (a static **pwapp** folder) to `.pwf/out/` |
| `pwf run .pwf/out` | Serves a built pwapp on a local port |
| `pwf pack` | Writes the deterministic `.pwpack` archive of the folder |

`pwf <command> --help` prints the options of one command.

## Checking all three

With the engine ([pwfabric/pwfabric](https://github.com/pwfabric/pwfabric))
cloned next to this repository as `../pwfabric` and built with `pnpm build`,
and the foundation as `../foundation` with its `.pwpack` built:

```sh
node check.mjs
```

For each app it copies the folder to a temporary directory and runs
`pwf add <the foundation>`, `pwf validate` and `pwf build`, failing on any
non-zero exit. With either anywhere else, pass `--cli <path to pwf's bin.js>`
(or `PWF_CLI`) and `--foundation <path to the .pwpack>` (or `PWF_FOUNDATION`).

## Licence

Apache License 2.0, see [LICENSE](LICENSE). Copy any of these as the start of
your own app.
