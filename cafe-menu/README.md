# Example Café menu

Diners at a table check dishes, diet tags and prices on their phone before they order.

- **User:** a guest who scanned the QR code on the table.
- **Core tasks:** browse one category at a time · narrow by one or more diets · open a dish's details · find the opening hours, the address and the phone number.
- **Shell:** one layout (`app/layout.receipt.json`) wraps every page, the not-found page included: the café's mark and name with the language switch (EN, TR), the page, the colour-scheme choice (Light, Dark, Device) and the address line, and a bottom bar (Menu, Visit) that marks the page in view. The dish page opens from the menu and returns to it.
- **Languages:** British English at the root, Turkish under `/tr/` with Turkish addresses (`/tr/yemek`, `/tr/ziyaret`). Every word is in `app/messages/en-GB.json` and `app/messages/tr.json`; a dish's words are its own fields (`name` and `nameTr`), picked by the catalogue (`"dish.name": "{nameTr}"` in Turkish). Page titles go through the app's title template, `%s · Example Café`.
- **Theme:** `theme-cafe-menu`, the app's own: warm cream and espresso, rounded corners, large type for a phone held at the table, with a dark variant; the cup mark reads on both. Nunito and Lora are shipped in `media/fonts/` (SIL Open Font License). The pictures are the café's own flat, overhead illustrations (`media/`), plus a sketch map of the way from the station.

| Page | What it is for |
|---|---|
| `menu` | Browse and narrow: a category control (Coffee, Breakfast, Bakery) and diet chips (Vegan, Vegetarian, Gluten-free). Diets combine — Vegan and Gluten-free together keep only the dishes that are both — and pressing a lit chip again drops it; **Clear diet** drops them all. The category and the diets stay in the address (`/menu?category=Bakery&vegan=yes`), so a reload, a shared link and the dish page's way back keep them. Each row is the dish's picture, its name as the link to its page, what is in it, one chip per diet and its price. While the list first loads, skeleton rows the size of the dish rows hold its place, and a spinner shows while it changes; when a diet leaves nothing, the page says so and offers every dish of the category; when a category is empty with no diet chosen, it says so, points to the counter, and offers another category or the opening hours; when the list cannot be read, it says so and offers **Try again**. The allergy note says where allergens are listed. The dishes are the café's own records (`MenuItem` in `app/content/`), in the café's order. |
| `dish` | One dish by the id in the address (`/dish?id=…`): its picture beside its name (also the tab title), what is in it, price, diet, allergens and when it is served (stacked on a phone). While it loads, a skeleton holds its place. **Back** returns to the dish's category with the diets the guest chose. An unknown id draws the not-found page at the same address; a failed read offers **Try again** or the menu. |
| `visit` | The café front, opening hours, address, phone, seats and step-free access, a sketch map, **Call** (a `tel:` link) and **Open the map in a new tab**, and a note for groups. |
| `notfound` | Not a page of its own: the in-shell page an unknown address or dish id meets (`app.notFound`), with the way back to the menu. |

**Records.** `MenuItem` (`app/definitions/entities.json`) is typed: the category is an enum, the
three diets are booleans (a vegan dish is also vegetarian), the price is a number written in
pounds, and every picture has its own description; each word field has its Turkish twin
(`nameTr`, `descriptionTr`, `allergensTr`, `servedTr`, `imageAltTr`). Anyone may read the
menu; nobody writes it through the app (`app/definitions/auth.json`).

```sh
pwf add ../foundation-3.0.0.pwpack
pwf dev
```

The rules every example app follows are in [../README.md](../README.md).
