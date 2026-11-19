# Example Light lighting hub

A household learns what an ambient lighting hub does, sees how setup works, picks a kit and joins the pre-order waitlist.

**User:** a prospective buyer furnishing a home.
**Core tasks:** understand what the hub does · see how setup works · choose a kit and join the waitlist.

Every page stands on the same evening stage (`stage-backdrop` with two `paint-layer`s) under the same floating capsule navigation (`pill-nav`: Home, How it works, Kits, and the Join the waitlist pill); every body is a `weave-pitch` column (the page's `main`; the capsule is its `header`, the footer its `footer`). Joining writes a `WaitlistEntry` record: name, email, the chosen kit (`studio`, `home` or `house`, required) and an optional note. The e-mail is an `email` field, so the server refuses one that is not shaped like an address; the server stamps `joinedAt`. The next edit after a result hides it, and after a sent entry clears the chosen kit. Waitlist entries are public create only: nobody can read them from the app. Each kit button names its kit and carries it to the form (`/plans?choice=home#waitlist`), which preselects it. An unknown address draws the app's own not-found page on the same stage (`app.notFound`).

| Page | Task | Patterns |
|---|---|---|
| `home` | Understand the product | `hero`, the hub picture, the `video` block (an evening in under a minute), `glass-panel` ×3 (tonight's readouts), `feature-card` ×3, `testimonial`, `logo-cloud` (lamp makers it works with), `band-cta` |
| `how-it-works` | See how setup works and a day of light | `band-process`, `band-split-media` ×3 (morning, dusk, night), `band-feature-grid` |
| `plans` (Kits) | Choose a kit and join the waitlist | `band-pricing` (whole-euro prices, one button per kit), `band-testimonial`, `faq`, `contact-form` (with the kit choice), a sketch map of the demo flat |
| `not-found` | An unknown address (not in the page list) | the same stage, capsule and footer |

**Theme:** `theme-lighting-hub-waitlist` (in `atoms/appearance/`): a warm near-black stage, cream ink, one amber light for action, Outfit headings over DM Sans, rounded glass shapes. Always the evening palette.

**Pictures:** our own SVG illustrations in one flat evening style (the hub, one living room at three times of day, five fictional lamp-maker wordmarks, a sketch map) and a 41-second film rendered from the same drawings, recorded in `media/provenance.json` (Apache-2.0).

The app's today is Tuesday 17 November 2026; the first kits ship in March 2027.

```sh
pwf add ../foundation-1.0.0.pwpack
pwf add ../widgets-1.0.0.pwpack
pwf dev
```

The rules every example app follows are in [../README.md](../README.md).
