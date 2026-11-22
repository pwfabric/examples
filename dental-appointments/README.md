# Example Dental Clinic appointments

A patient asks for an appointment; reception signs in, calls them back and marks the request booked or declined.

- **Users:** a patient of a small clinic, on a phone or a laptop · the clinic's reception.
- **Core tasks:** see what the clinic does and who works there · send a request (service, day, morning or afternoon, how to call back) · reception: sign in, work through the new requests, call, mark each one.
- **Shell:** one layout (`app/layout.receipt.json`) wraps every page, the not-found page included: the top bar (Services, Dentists, and **Request an appointment**, which marks its page), the page, and a footer with the address and hours, the colour-scheme choice (Light, Dark, Device) and **Reception sign-in**.
- **Theme:** `theme-dental-appointments`, the app's own: mint ground, deep teal ink and buttons, soft corners, Figtree (shipped in `media/fonts/`, SIL Open Font License), with its own dark variant. The pictures are the clinic's own flat illustrations (`media/`).

| Page | What it is for |
|---|---|
| `services` | The entry page. What the clinic does, from its `Service` records: each with its time, its starting price (or "No charge") and **Request this**, which opens the form with that service chosen (`/request?service=<id>`). How a request works, in three steps, and the number to ring when it hurts today. Its title names the clinic itself, so it opts out of the title template. |
| `dentists` | Who a patient may see, from the `Dentist` records: picture, role, a line about them, their days in clinic and languages, and **Ask for …**, which opens the form with them chosen (`/request?dentist=<id>`). |
| `request` | The form: the service (from the records), a dentist or no preference, a day from tomorrow to ninety days ahead (never a Sunday), morning or afternoon, name, phone, an optional e-mail and note, and the consent box. Sending writes one `AppointmentRequest`; the server sets its status (`new`) and when it was sent. A sent request empties the form and says what happens next; a refused one says why, in the clinic's words. Beside it: the opening hours and the emergency line. |
| `reception` | Signed out: a sign-in form (e-mail and password). Signed in without the reception role: a note and **Sign out**. Reception: the requests, filtered by status (New, Booked, Declined, All — kept in the address, `?status=`), soonest day first. Each card says who, what, with whom, when, how to reach them and when it was sent, with **Call**, **Mark booked**, **Decline** and **Back to new**; each button writes that one request's status, and the list refreshes from the server. |
| `not-found` | Not a page of its own: the in-shell page an unknown address meets (`app.notFound`), with the ways on. |

**Records and rules.** `app/definitions/entities.json` types three collections: `Service` and `Dentist` (shipped in `app/content/`), and `AppointmentRequest` — the service and the dentist are relations to those records, the day a date, the time of day an enum, the e-mail an `email` field, the consent box must be ticked (`mustBe: true`), and the status an enum the server starts at `new`. `app/definitions/auth.json` lets anyone read the services and the dentists and **create** a request, and only the `reception` role **read and update** requests; registration is closed, so the reception account is the one the clinic makes. `app/data/AppointmentRequest.json` holds four requests to try reception with under `pwf dev` (never published).

```sh
pwf add ../foundation-2.0.0.pwpack
pwf dev
```

Under `pwf dev`, sign in on the reception page as `dev@localhost` (any password): the local host gives that address every role the app declares, and any other address none, so both screens can be tried.

The rules every example app follows are in [../README.md](../README.md).
