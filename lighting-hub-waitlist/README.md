# Example Light lighting hub

A household learns what an ambient lighting hub does, sees how setup works, picks a kit and joins the pre-order waitlist.

**User:** a prospective buyer furnishing a home.
**Core tasks:** understand what the hub does · see how setup works · choose a kit and join the waitlist.

Every page stands in one layout (`app/layout.receipt.json`), written once: the evening stage (`stage-backdrop` with two `paint-layer`s), the floating capsule navigation (`pill-nav`: Home, How it works, Kits, the colour-scheme control and the Join the waitlist pill) and the footer; each page's blocks fill its `main` (`weave-pitch`). A page lights its own pill by seeding `here` in its state; the not-found page seeds none, so no pill is lit. Document titles follow `titleTemplate` (`Kits · Example Light`); the home page names the app itself and opts out. 
| Page | Task | Patterns |
|---|---|---|
| `home` | Understand the product | `hero`, the hub picture, the `video` block (an evening in under a minute), `glass-panel` ×3 (tonight's readouts), `feature-card` ×3 (each card is the link to where it points), `testimonial`, `logo-cloud` (lamp makers it works with), `band-cta` |
| `how-it-works` | See how setup works and a day of light | `band-process`, `band-split-media` ×3 (morning, dusk, night), `band-feature-grid` |
| `plans` (Kits) | Choose a kit and join the waitlist | `band-pricing` (whole-euro prices, one button per kit), `band-testimonial`, `faq`, `contact-form` (with the kit choice), a sketch map of the demo flat |
| `not-found` | An unknown address (not in the page list) | the same stage, capsule and footer |

**Theme:** `theme-lighting-hub-waitlist` (in `atoms/appearance/`): an evening palette (the dark variant: a warm near-black ground, cream ink, one amber light for action, Outfit headings over DM Sans, both shipped in `media/fonts/` under the SIL Open Font License, rounded glass shapes) and a daylight palette (cream ground, espresso ink, deep amber). The page follows the device until the visitor chooses. The `theme-toggle` in the capsule offers Daylight, Evening and As your device, and the choice is kept for the next visit. The lamp makers' wordmarks sit on an evening strip in both.

**Pictures:** our own SVG illustrations in one flat evening style (the hub, one living room at three times of day, five fictional lamp-maker wordmarks, a sketch map) and a 41-second film rendered from the same drawings, recorded in `media/provenance.json` (Apache-2.0).

The app's today is Tuesday 17 November 2026; the first kits ship in March 2027.

```sh
pwf add ../foundation-3.1.0.pwpack
pwf add ../widgets-3.0.0.pwpack
pwf dev
```

The rules every example app follows are in [../README.md](../README.md).
