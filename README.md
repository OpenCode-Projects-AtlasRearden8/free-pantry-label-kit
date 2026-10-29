# Free Pantry Label Kit

Free printables for a pantry that talks back: labels and cards that ask for refills,
date their own freezer bags, and tell you exactly how long everything keeps.

Everything here is:

- **Free** — no accounts, no sign-ups, no watermarks, no contact info baked into the PDFs
- **Local-first** — plain HTML/CSS sources print to PDF with one build script, right on your machine
- **Tested** — the test suite builds every sheet and verifies it comes out as a valid, printable PDF
- **Beginner-friendly** — fold-and-cut notes on every sheet; scissors and tape are the only tools

## What's inside

The finished, ready-to-print PDFs live in `printables/`:

| Sheet | What it is | Notes |
|---|---|---|
| `how-to-fold-and-cut.pdf` | Assembly guide | Start here: the legend (dashed = cut, dotted = fold) and folding demos |
| `jar-labels-plain.pdf` | 18 fold-over jar labels, plain style | Staple pantry names; date lines on the back |
| `jar-labels-script.pdf` | 18 fold-over jar labels, script style | Same labels in a handwritten style |
| `canister-labels-plain.pdf` | 18 fold-over canister labels, plain style | For bigger drums and snap-top canisters |
| `canister-labels-script.pdf` | 18 fold-over canister labels, script style | Same labels, script style |
| `spice-blend-cards.pdf` | 6 fold-in-half recipe cards | Taco, curry, pumpkin pie, ranch, Italian herb, chili |
| `baking-mix-cards.pdf` | 6 fold-in-half recipe cards | Pancake, cookie, brownie, cornbread, muffin, dinner rolls |
| `freezer-date-labels.pdf` | 15 write-on freezer-bag labels | Pre-bucketed by food type with "use within" windows |
| `batch-meal-labels.pdf` | 6 big freezer-pack labels | Chili, taco beef, curry, lasagna, meatballs, soup — with reheat notes |
| `use-within-chart.pdf` | One-page cheat chart | Pantry / fridge / freezer "use within" reference, for the cabinet door |
| `shelf-category-map.pdf` | 2 pages | A blank write-in map plus a filled starter map for the pantry door |
| `write-in-refill-cards.pdf` | 9 refill request cards | One empty jar = one card; toss when bought |

Editable sources are the HTML files in `src/sheets/` plus the shared stylesheet
`src/print.css`. Want different jar names, your own spice blends, or another page
size? Edit a sheet and rebuild — every printable is just HTML and CSS.

## How to build

Prerequisites: **Node.js** and any locally installed **Chrome or Chromium**
(no other npm dependencies are used; the build talks to your local browser only).

```bash
npm run build    # renders every sheet in src/sheets/ into printables/
npm test         # rebuilds, then verifies every PDF is valid US-Letter output
```

If Chrome is not on your `PATH`, point the build at it:

```bash
FREE_PANTRY_CHROME=/path/to/chrome npm run build
```

## How to print

1. Print on **US Letter** paper at **100% scale** ("Actual size" — never "fit to page"),
   single-sided.
2. Follow the fold-and-cut notes on each sheet: dashed lines are cuts, dotted lines
   are folds, thin grey rules are write-in lines.
3. Fold-over jar and canister labels hang over the jar rim; cards fold in half so the
   recipe hides inside; freezer labels get taped onto bags.
4. Laminating or clear packing tape makes anything touching a canister survive spills.

## Design principles

- **Unbranded PDFs**: the printables contain no name, logo, or URL — they are for
  thriving pantries, not marketing.
- **Fold-and-cut only**: no special paper, cutting machines, or measuring jigs required.
- **Plain English everywhere**, in the spirit of explaining things "like a friend would".
- **Food-date guidance is friendly education, not medical or safety advice** — when in
  doubt, look, smell, and toss; your local extension office wins arguments.

## Repository layout

```
src/print.css          shared print stylesheet (page size, cut/fold styles, fonts)
src/sheets/*.html      one HTML file per printable sheet
tools/sheets.json      the manifest: every sheet the build must produce
tools/build.js         the one build script (render HTML → PDF via local Chrome)
tools/test.js          tests: build + validate every PDF
printables/            the generated, unbranded PDFs
```

## License

MIT — see `LICENSE`. Brought to you by **Asdale Dynamics, LLC**, which makes
beginner-friendly AI guides and practical small tools. Plain-English AI help can be
found at the hub site `dylanasdale.github.io`.
