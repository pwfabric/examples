# Example Team kit

A small team borrows and returns its shared equipment: cameras, laptops, audio and lights.

- **User:** a member of Example Team who needs a camera or a laptop for a day or a week.
- **Core tasks:** find a free piece of kit · borrow it with a return date · mark it returned · see who has what.
- **Signed in.** `app/definitions/auth.json` requires sign-in (password, registration `closed`: the
  accounts are the ones the team was given). Only the `team` role may read and change the records;
  a signed-in account without it is told so in the app's words. The sign-in wall's words are the
  app's (`gate.*`, `session.*` in `app/plan.json`).
- **Shell:** one layout (`app/layout.receipt.json`): the top bar with the account control
  (`navigation.json` `account`, placement `navbar`), the Foundation `layout.sidebar` (Equipment,
  History) beside the page, which folds behind one button on a phone, and the footer with the
  colour-scheme control (`theme-toggle`). The sidebar marks the section a page seeds in
  `state.section`, so an equipment page belongs to Equipment.
- **Titles:** `titleTemplate` (`Mirrorless camera · Example Team kit`).
- **Theme:** `theme-equipment-checkout`, the app's own: calm utility, a cool grey ground, ink-blue
  type, one teal accent, compact rounded controls; a slate dark variant.

| Page | What it is for |
|---|---|
| `equipment` | Everything the team owns, as cards that open each piece: tag, kind, name, and Available, Out or Overdue with who has it and until when. Search (name or tag), kind and **Available now** combine and live in the address. While the list loads a skeleton holds its place; when nothing matches, the page says so and offers to show everything. |
| `item` | One piece by the id in the address (`/item?id=…`): picture, tag, name, what is in the bag and where it is kept. Available: **Borrow it** with a **Back by** date (no earlier than today) and an optional note. Out: who has it and until when (**Overdue** past the date) and **Mark as returned**. Then its last five loans. An unknown id draws the not-found page at the same address. |
| `history` | Every loan, newest first, narrowed to those still out or returned; each equipment name links to its page. On a phone each row is a card. |
| `not-found` | What an unknown address or equipment id meets, inside the frame. |

**Records.** `Equipment` (`app/content/Equipment.json`, nine pieces) and `Loan` are typed in
`app/definitions/entities.json`. Borrowing writes two records: the form creates a `Loan`, whose
borrower, owner and time the server stamps (`ownerName`, `owner`, `createdAt`), and the item is
updated to `out` with the borrower and the date. Returning updates the item back to `available`
and closes its open loan with today's date. `app/data/Loan.json` holds a few past loans to try
the app with; they are never published.

**Try it.** `pwf dev` serves the app with its local host: sign in as `dev@localhost` (any
password; the development account has every declared role, so it is on the team). The local
host keeps the records in memory; nothing survives a restart.

**Pictures:** our own flat SVG drawings of each piece of kit, recorded in `media/provenance.json`
(Apache-2.0).

```sh
pwf add ../foundation-2.0.0.pwpack
pwf dev
```

The rules every example app follows are in [../README.md](../README.md).
