# Example Meetup sign-up

A community meetup's evening: what is on, who is speaking, and a free sign-up that closes when the room is full. The organiser signs in and sees who is coming. In English and Turkish.

- **Users:** someone who builds for the web in Exampleton, deciding whether to come · the meetup's organiser.
- **Core tasks:** see when, where and what · see who is speaking · save a place while there is one · organiser: sign in and see the list.
- **Shell:** one layout (`app/layout.receipt.json`) wraps every page, the not-found page included: a slim bar with the language switch (English, Türkçe) and the colour-scheme choice, the top bar (Programme, Speakers, and **Sign up**), the page, and a footer with where the meetup meets and **Organiser sign-in**.
- **Languages:** `en` at the root, `tr` under `/tr/`, with Turkish addresses (`/tr/konusmacilar/`, `/tr/kayit/`, `/tr/katilimcilar/`). Every word is in `app/messages/en.json` and `app/messages/tr.json`; a record's words are its own fields (`title` and `titleTr`), picked by the catalogue (`"talk.title": "{titleTr}"` in Turkish). Page titles go through the app's title template, `%s · Example Meetup`.
- **Theme:** `theme-meetup-signup`, the app's own: night indigo with a coral spark, Space Grotesk headings over Inter (both shipped in `media/fonts/`, SIL Open Font License), with its own dark variant. The pictures are the meetup's own flat illustrations (`media/`).

| Page | What it is for |
|---|---|
| `programme` | The entry page: the meetup from its `Meetup` record (name, day, doors), how many places are left, **Sign up** while there are any, the programme from the `Talk` records (a talk names its speaker; a break does not), and where it is. Its title says what the meetup is, so it opts out of the title template. |
| `speakers` | The three speakers from the `Speaker` records: picture, role, a line about them, and the talk the programme gives them. |
| `signup` | Name, e-mail, a pizza choice and the consent box; sending writes one `Signup`. Places left is shown above the form; at none, the form gives way to a "full" notice. A sent sign-up says so and offers to sign up someone else; a second sign-up with the same e-mail is refused by the server (a unique key) and the page says so. |
| `attendees` | Signed out: a sign-in form. Signed in without the organiser role: a note and **Sign out**. The organiser: how many have signed up (a plural message) against the capacity, and a sortable, searchable table of names, e-mails, pizza choices and when each signed up. |
| `not-found` | Not a page of its own: the in-shell page an unknown address meets (`app.notFound`), with the way back to the programme. |

**Places left** is one plural message per language — `{left, plural, =0 {No places left} one {# place left} other {# places left}}` and `{left, plural, =0 {Yer kalmadı} one {# yer kaldı} other {# yer kaldı}}` — filled from the meetup's `capacity` minus the count of sign-ups (an `aggregate` source; visitors may `count` sign-ups but not read them). The page works it out once its data has arrived. The capacity is kept by the page, not by the server: the format has no rule for the largest number of records a collection may hold, so two people taking the last place in the same second could both get in.

**Records and rules.** `app/definitions/entities.json` types `Meetup`, `Speaker` and `Talk` (shipped in `app/content/`) and `Signup` (the diet is an enum, the e-mail an `email` field and a unique key, the server stamps `signedAt`). `app/definitions/auth.json` lets anyone read the meetup, the speakers and the talks, and create and count sign-ups; only the `organiser` role reads them. Registration is closed. `app/data/Signup.json` holds 37 sign-ups to try the app with under `pwf dev` (never published), which leaves three places.

```sh
pwf add ../foundation-2.0.0.pwpack
pwf dev
```

Under `pwf dev`, sign in on the attendees page as `dev@localhost` (any password): the local host gives that address every role the app declares.

The rules every example app follows are in [../README.md](../README.md).
