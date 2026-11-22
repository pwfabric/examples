# PWFabric examples

Six complete apps you can build and run with nothing but the `pwf` command
line: no account and no hosted service. Each folder is a **pwpack**, the
source form of a PWFabric app (`pwpack.json`, its pages and records under
`app/`, its own theme under `atoms/`, its pictures under `media/`), built from
the open [foundation and widgets packs](https://github.com/pwfabric/packs).

| App | The need it serves | Packs |
|---|---|---|
| [`cafe-menu`](cafe-menu/) | Example Café: the menu a guest opens from the QR code on the table. Dishes by category with diet tags, allergens and prices, and how to find the café. Reads the app's own records. In English and Turkish. | foundation 2 |
| [`dental-appointments`](dental-appointments/) | Example Dental Clinic: a patient requests an appointment; reception signs in, sees the requests and marks each one booked or declined. Access rules let anyone create a request and only reception read and update them. | foundation 2 |
| [`equipment-checkout`](equipment-checkout/) | Example Team kit: a small team borrows and returns shared cameras, laptops and lights. Signed in; a filtered equipment list, a page per piece to borrow or return it, and the loan history. Who has what is a loan the server stamps, and only its borrower or the kit keeper closes it. A sidebar layout that folds on a phone. | foundation 2 |
| [`lighting-hub-waitlist`](lighting-hub-waitlist/) | Example Light: a lighting hub's website before launch. What it does, how it works, the kits, and a waitlist that writes a record. One layout for every page, a daylight and an evening palette with a colour-scheme choice, composed page titles. | foundation 2, widgets 2 |
| [`meetup-signup`](meetup-signup/) | Example Meetup: a community evening's programme and speakers, a sign-up that closes when the forty places are gone ("3 places left" is a plural message), and the organiser's attendee list. In English and Turkish. | foundation 2 |
| [`studio-portfolio`](studio-portfolio/) | Example Architects: an architecture studio shows its projects and takes enquiries. A gallery of linked project cards, a page per project, how the studio works, and a contact form that writes a record; the layout responds through breakpoint-valued props. | foundation 2 |

## Running one

The command line is on npm (Node 22 or newer; `pwf` 3.5 or newer). Download
`foundation-2.0.0.pwpack` (for the lighting app, `foundation-1.0.0.pwpack` and
`widgets-1.0.0.pwpack`) from the [packs releases](https://github.com/pwfabric/packs/releases), then:

```sh
npm install -g @pwfabric/cli
cd cafe-menu
pwf add ../foundation-2.0.0.pwpack
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
  (`atoms/appearance/theme-<app>/`), with its own dark mode, and one shell,
  written once where the app has a layout (`app/layout.receipt.json`).
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
exits 0. The packs folder may hold several versions of a pack: each app gets
the newest within its range. CI runs it against the packs built from
[pwfabric/packs](https://github.com/pwfabric/packs) and the published `pwf`.

## Licence

Apache License 2.0 ([`LICENSE`](LICENSE)), the apps' illustrations included.
