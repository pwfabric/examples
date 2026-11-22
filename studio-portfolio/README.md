# Example Architects portfolio

An architecture studio shows its projects and takes enquiries.

- **User:** someone thinking about a building (a household, a co-operative, a council) deciding whether to talk to this studio.
- **Core tasks:** look through the work · open a project · learn how the studio works · send an enquiry.
- **Shell:** one layout (`app/layout.receipt.json`, the `layout-topbar` pattern): the top bar (Projects, About, Contact; the engine marks the page in view), the page, and the footer with the studio's address and the colour-scheme control (`theme-toggle`: Light, Dark, As your device, kept for the next visit). The not-found page wears it too.
- **Titles:** `titleTemplate` in `app/plan.json` (`Riverside Library · Example Architects`); the projects page names the studio itself and opts out.
- **Theme:** `theme-studio-portfolio`, the app's own: paper and ink, a warm off-white ground, near-black type, one brick-red accent, a serif for headings, square corners; a charcoal dark variant with a terracotta accent.

| Page | What it is for |
|---|---|
| `projects` | The work at a glance: one tile per project (picture, type, place, year, name, one line), each tile a card whose `href` opens the project. The tiles reflow to as many per line as fit (`minCellWidth` is a breakpoint map). While the projects load a skeleton holds their place; a failed read offers **Try again**. |
| `project` | One project by the id in the address (`/project?id=…`): type and place, name (also the tab title), the summary, the picture, the story and the facts (type, place, client, floor area, status), and **Talk to us about a project like this**. The story and the facts sit side by side from the `lg` breakpoint and stack below it (breakpoint-valued `direction`, `gap`, `align` and `aspectRatio`). An unknown id draws the not-found page at the same address. |
| `about` | The studio, its picture, how it works with a client in three steps (a row on a wide screen, a column on a phone), the three partners, one call to the contact page. |
| `contact` | The enquiry form: name, e-mail, what kind of building, where (optional) and the message. Sending writes an `Enquiry` record; the page says it arrived, or why it did not, in its own words, and the next edit hides the result. The studio's address, e-mail and phone sit beside the form on a wide screen and above it on a phone. |
| `not-found` | Not a page of its own: what an unknown address or project id meets (`app.notFound`), with the ways back. |

**Records.** `Project` (`app/content/Project.json`, six projects) is typed in
`app/definitions/entities.json`: the type and the status are enums, the year and
the floor area are numbers, and every picture has its own description. `Enquiry`
has an `email` field, so the server refuses one that is not shaped like an
address, and the server stamps `sentAt`. Anyone may read the projects; anyone
may send an enquiry, and nobody can read the enquiries from the app
(`app/definitions/auth.json`).

**Pictures:** our own flat SVG illustrations of the six buildings and the studio,
recorded in `media/provenance.json` (Apache-2.0).

```sh
pwf add ../foundation-2.0.0.pwpack
pwf dev
```

The rules every example app follows are in [../README.md](../README.md).
