# STATUS.md — Free Pantry Label Kit

Last updated: 2026-10-29

## What was built

A complete free printable kit for a pantry that talks back, per the original goal:

- **Jar and canister labels in plain and script styles** — four sheets
  (`jar-labels-plain`, `jar-labels-script`, `canister-labels-plain`,
  `canister-labels-script`), 18 fold-over labels per sheet (2 pages × 9), with
  "refilled / use by" lines on the folded-back side.
- **Spice-blend cards** — one page, 6 fold-in-half recipe cards (taco, curry,
  pumpkin pie, ranch, Italian herb, chili) with ingredients, use-within window,
  and a usage tip; the recipe hides inside the fold.
- **Baking-mix cards** — same card format, 6 mixes (pancake, cookie, brownie,
  cornbread, banana muffin, dinner rolls) with "add wet + bake" steps on the back.
- **Freezer-bag date labels** — 15 write-on labels bucketed by food category
  (cooked dishes, raw meat, fruit+veg, soups/stock, breads/doughs, open-ended)
  with item / date-in / date-out lines and printed "use within" windows.
- **Batch-meal labels** — 6 big freezer-pack labels (chili, taco beef, curry,
  lasagna, meatballs, any-pot soup) with write-in dates and reheat instructions.
- **Use-within cheat chart** — one page, three columns (pantry / fridge / freezer),
  12 foods each with use-within windows, plus weekly/monthly/seasonal habits and a
  clear education-not-advice disclaimer.
- **Shelf category maps** — 2 pages: a blank write-in map (7 zones plus a cut-out
  door strip) and a filled starter map to copy or adjust.
- **Write-in refill cards** — 9 cut-out refill-request cards (item, size+brand,
  bought from, asked on) so a jar can literally ask for its own refill.
- **How-to sheet** — fold-and-cut legend, step-by-step instructions, and two
  fold demonstrations (fold-over rim label, fold-in-half card).

Every sheet's HTML/CSS source carries fold-and-cut notes directly: dashed =
cut, dotted = fold, thin grey rule = write-in.

## How to run it

```bash
npm run build    # render every sheet in src/sheets/ into printables/
npm test         # rebuild, then run the full validation suite
```

Requirements: Node.js and a local Chrome/Chromium (auto-detected; override with
`FREE_PANTRY_CHROME=/path/to/chrome`). No npm packages, no network, no accounts.

To print: US Letter at 100% scale ("Actual size"), single-sided. The PDFs in
`printables/` are committed and ready to print as-is, unbranded.

## Verification results

`npm test` (2026-10-29, this working tree): **all checks passed** for all 12 sheets.

- Build step: every manifest sheet renders through the one build script
  (`tools/build.js`, headless Chrome print-to-PDF).
- Structural checks per PDF: `%PDF-` header, `%%EOF` trailer, >10 KiB of content,
  page objects present, US-Letter page box (612×792pt confirmed via pypdf).
- Page-count checks: every sheet's actual page count matches its manifest entry.
- Unbranding checks: HTML sources and finished PDFs scanned for any printer
  branding — none found.
- Output hygiene: no stray files in `printables/`.
- Visual pass: pages rendered to PNG and reviewed; grids fill the letter page,
  fold/cut lines are visible, script fonts (Niconne/Dancing Script family) render.

## Known gaps / ideas for later

- Fonts are whatever machine-rendered the PDF. If you rebuild on a machine without
  the common Google fonts used here (Sen, Niconne, Kalam, Hind), Chrome falls back
  to defaults and the look changes (still valid pages, still letter-size — tests
  stay green). Vendoring the small font subset into the repo would freeze the look.
- US Letter only; an A4 page-size variant is easy to add (one `@page` rule per sheet)
  but not tested or shipped.
- The use-within numbers are friendly rules of thumb, not a regulatory source;
  they lean generic on purpose. Local extension-office numbers could be added per region.
- Label-adhesive stock (full-sheet sticker paper) would skip the tape step; the
  geometry assumes plain paper + packing tape and is not tuned for die-cut Avery grids.
- No dark/full-bleed decorative themes yet — deliberately plain to keep ink costs low.

## Project facts

- 12 sheets / 12 PDFs / 24 printable pages total.
- License: MIT — `Copyright (c) 2026 Asdale Dynamics, LLC` (see `LICENSE`).
- Brought to you by Asdale Dynamics, LLC; see README for repo tour and credit.
