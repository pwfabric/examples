# Example Team kit

A small team borrows and returns its shared equipment: cameras, laptops, audio and lights.

- **User:** a member of Example Team who needs a camera or a laptop for a day or a week.
- **Core tasks:** find a free piece of kit · borrow it with a return date · mark it returned · see who has what.
- **Signed in.** `app/definitions/auth.json` requires sign-in (password, registration `closed`: the
  accounts are the ones the team was given). The sign-in wall's words are the app's (`gate.*`,
  `session.*` in `app/plan.json`).
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
| `item` | One piece by the id in the address (`/item?id=…`): picture, tag, name, what is in the bag and where it is kept. Free: **Borrow it** with a **Back by** date (no earlier than today) and an optional note. Out: who has it and until when (**Overdue** past the date); the borrower and the kit keeper see **Mark as returned**. Then its last five loans. An unknown id draws the not-found page at the same address. |
| `history` | Every loan, newest first, narrowed to those still out or returned; each equipment name links to its page. |
| `not-found` | What an unknown address or equipment id meets, inside the frame. |

**Records and who may change them.** `Equipment` (`app/content/Equipment.json`, nine pieces) and
`Loan` are typed in `app/definitions/entities.json`.

- A piece of kit is out while it has an open `Loan`; nothing about loans is stored on the
  `Equipment` record. Pages read the open loans and look each piece up in them.
- **Borrowing creates a Loan.** The page sends the item, the date and the note; the server stamps
  who borrowed it (`owner`, and `borrower`, the account's name) and when (`createdAt`). No name
  the page writes is ever shown as the borrower.
- **Returning closes your own Loan** (`status: returned`, the date). The `team` role may create
  loans and update only its own (`update own`); the `keeper` role may close anyone's.
- **Equipment is read-only to the team**; only the `keeper` role writes it.

`app/data/Loan.json` holds a few past loans to try the app with; they are never published.

**Try it.** `pwf dev` serves the app with its local host: sign in as `dev@localhost` (any
password; the development account has every declared role, so it is on the team and the kit
keeper). The local host keeps the records in memory; nothing survives a restart.

**Pictures:** our own flat SVG drawings of each piece of kit, recorded in `media/provenance.json`
(Apache-2.0).

```sh
pwf add ../foundation-2.0.0.pwpack
pwf dev
```

The rules every example app follows are in [../README.md](../README.md).
