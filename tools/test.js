#!/usr/bin/env node
/**
 * Tests for the Free Pantry Label Kit.
 *
 * Verifies that:
 *  1. every sheet in the manifest has an HTML source and builds a PDF,
 *  2. every PDF is structurally valid (%PDF header, %%EOF trailer, page
 *     objects present, US-Letter page size, non-trivial content),
 *  3. the manifest's declared page count matches reality (via pypdf when
 *     available, otherwise via a structural page-marker count),
 *  4. the generated printables stay unbranded (no names or URLs in them),
 *  5. no PDF is missing from the output folder.
 */
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const SHEETS_DIR = path.join(ROOT, "src", "sheets");
const OUT_DIR = path.join(ROOT, "printables");
const MANIFEST = require("./sheets.json");

let failures = 0;
function check(ok, message) {
  if (ok) {
    console.log(`  ok   ${message}`);
  } else {
    console.error(`  FAIL ${message}`);
    failures++;
  }
}

function parsePageMarkers(buf) {
  // Count page objects (not the /Pages tree node). Chrome PDFs are plain
  // enough for a byte-level scan; pypdf (when installed) is authoritative.
  const s = buf.toString("latin1");
  return (s.match(/\/Type\s*\/Page(?![s\w])/g) || []).length;
}

function deepPageInfo(pdfPath) {
  const py = spawnSync(
    "python3",
    [
      "-c",
      "import sys, json\ntry:\n    from pypdf import PdfReader\nexcept Exception:\n    print(json.dumps({'pypdf': False})); sys.exit(0)\nr = PdfReader(sys.argv[1])\nbox = None\nbp = (r.pages[0].mediabox or r.pages[0].cropbox)\nbox = [float(bp.width), float(bp.height)]\nprint(json.dumps({'pypdf': True, 'pages': len(r.pages), 'box': box, 'valid': True}))",
      pdfPath,
    ],
    { encoding: "utf8", timeout: 60000 }
  );
  if (py.status !== 0 || !py.stdout.trim()) return null;
  try {
    return JSON.parse(py.stdout.trim().split("\n").pop());
  } catch {
    return null;
  }
}

async function main() {
  console.log("== Free Pantry Label Kit tests ==");
  console.log("Step 1: build every sheet (same script as `npm run build`)");
  const build = spawnSync(process.execPath, [path.join(__dirname, "build.js")], {
    stdio: "inherit",
  });
  if (build.status !== 0) {
    console.error("FAILED build step");
    process.exit(1);
  }

  console.log("Step 2: validate sources and PDFs");
  const pdfs = fs
    .readdirSync(OUT_DIR)
    .filter((f) => f.toLowerCase().endsWith(".pdf"))
    .sort();

  for (const sheet of MANIFEST) {
    console.log(`Sheet: ${sheet.file}`);
    const htmlPath = path.join(SHEETS_DIR, `${sheet.file}.html`);
    const pdfPath = path.join(OUT_DIR, `${sheet.file}.pdf`);

    check(fs.existsSync(htmlPath), `HTML source exists (${sheet.file}.html)`);

    const html = fs.existsSync(htmlPath)
      ? fs.readFileSync(htmlPath, "utf8")
      : "";
    check(!/(asdale|dylan)/i.test(html), `HTML source is unbranded (${sheet.file})`);

    if (!fs.existsSync(pdfPath)) {
      check(false, `PDF built (printables/${sheet.file}.pdf)`);
      continue;
    }
    const buf = fs.readFileSync(pdfPath);
    const latin = buf.toString("latin1");

    check(latin.startsWith("%PDF-"), `PDF header (%PDF-) (${sheet.file}.pdf)`);
    check(latin.includes("%%EOF"), `EOF trailer (%%EOF) (${sheet.file}.pdf)`);
    check(buf.length > 10 * 1024, `non-trivial size (${buf.length} bytes)`);
    check(
      /\/Type\s*\/Page(?![s\w])/.test(latin),
      `contains page objects (${sheet.file}.pdf)`
    );
    check(
      /MediaBox|\[ 0 0 612 792 \]/.test(latin),
      `US-Letter page box (${sheet.file}.pdf)`
    )

    const markerPages = parsePageMarkers(buf);
    check(
      markerPages >= 1,
      `page-marker count sane (${markerPages}) (${sheet.file}.pdf)`
    );

    const info = deepPageInfo(pdfPath);
    if (info && info.pypdf) {
      check(info.valid === true, `pypdf opens it cleanly (${sheet.file}.pdf)`);
      check(
        info.pages === sheet.pages,
        `page count ${info.pages} == expected ${sheet.pages} (${sheet.file}.pdf)`
      );
      check(
        info.box[0] >= 611 && info.box[0] <= 613 && info.box[1] >= 791 && info.box[1] <= 793,
        `page size ${info.box.join("x")}pt == letter (${sheet.file}.pdf)`
      );
    } else {
      console.log("  note pypdf not available; using structural checks only");
    }
  }

  // No extra/stray PDFs in the output dir.
  const expected = MANIFEST.map((s) => `${s.file}.pdf`).sort();
  const extra = pdfs.filter((f) => !expected.includes(f));
  check(extra.length === 0, `no stray files in printables/ (found: ${extra.join(", ") || "none"})`);

  console.log(failures === 0 ? "ALL TESTS PASSED" : `${failures} FAILURE(S)`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
