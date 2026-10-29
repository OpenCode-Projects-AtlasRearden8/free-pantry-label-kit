#!/usr/bin/env node
/**
 * One build script for the Free Pantry Label Kit.
 * Renders every HTML sheet in src/sheets/ to an unbranded PDF in printables/,
 * using a locally installed Chrome/Chromium in headless mode (no accounts,
 * no network, no secrets).
 */
const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const SHEETS_DIR = path.join(ROOT, "src", "sheets");
const OUT_DIR = path.join(ROOT, "printables");
const MANIFEST = require("./sheets.json");

const CHROME_CANDIDATES = [
  process.env.FREE_PANTRY_CHROME,
  "google-chrome",
  "google-chrome-stable",
  "chromium",
  "chromium-browser",
  "chrome",
].filter(Boolean);

function findChrome() {
  for (const candidate of CHROME_CANDIDATES) {
    try {
      execFileSync(candidate, ["--version"], { stdio: "pipe", timeout: 20000 });
      return candidate;
    } catch {
      /* keep looking */
    }
  }
  return null;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const chrome = findChrome();
  if (!chrome) {
    console.error(
      "No Chrome/Chromium found. Install one (e.g. 'google-chrome') or set\n" +
        "FREE_PANTRY_CHROME=/path/to/chrome and run again. Layout is standard\n" +
        "print CSS, so Chromium and any rebranded Chromium build work too."
    );
    process.exit(1);
  }
  process.stderr.write(`Using browser: ${chrome}\n`);

  let failed = 0;
  for (const sheet of MANIFEST) {
    const htmlPath = path.join(SHEETS_DIR, `${sheet.file}.html`);
    if (!fs.existsSync(htmlPath)) {
      console.error(`MISSING source: ${htmlPath}`);
      failed++;
      continue;
    }
    const outPath = path.join(OUT_DIR, `${sheet.file}.pdf`);
    const args = [
      "--headless",
      "--disable-gpu",
      "--no-sandbox",
      "--no-pdf-header-footer",
      "--virtual-time-budget=3000",
      `--print-to-pdf=${outPath}`,
      `file://${htmlPath}`,
    ];
    try {
      execFileSync(chrome, args, { stdio: "pipe", timeout: 120000 });
      const bytes = fs.statSync(outPath).size;
      if (bytes < 2000) throw new Error(`suspiciously small output (${bytes} bytes)`);
      console.log(`built  printables/${path.basename(outPath)}  (${(bytes / 1024).toFixed(1)} KiB)`);
    } catch (err) {
      console.error(`FAILED ${sheet.file}: ${err.message}`);
      failed++;
      try {
        fs.unlinkSync(outPath);
      } catch {}
    }
  }
  if (failed) {
    console.error(`Build finished with ${failed} failure(s).`);
    process.exit(1);
  }
  console.log(`Done. ${MANIFEST.length} PDFs in printables/.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
