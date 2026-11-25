// The Router Confesses — one-line entry writer.
// Publishes a single excuse line to /output/entry.txt after gate checks.
// The router admits it was judging the viewer's taste, not buffering.

import { mkdirSync, writeFileSync, readFileSync, statSync, chmodSync } from "node:fs";

const OUT_DIR = "/output";
const OUT_FILE = "/output/entry.txt";

// The confession, byte-identical to the final line.
const LINE = "Oops. I was busy judging your taste — anyone who skips the credits doesn't deserve to see who the killer is.";

function gateCheck(text: string): void {
  // Gate: UTF-8 text, 1-200 characters, not only whitespace, single line.
  const chars = [...text].length;
  if (chars < 1 || chars > 200) {
    throw new Error(`gate: character count ${chars} outside 1-200`);
  }
  if (text.trim().length === 0) {
    throw new Error("gate: text is only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("gate: text must be a single line");
  }
  // UTF-8 round-trip check.
  const buf = Buffer.from(text, "utf8");
  if (buf.toString("utf8") !== text) {
    throw new Error("gate: text is not valid UTF-8");
  }
}

function publish(): void {
  // Validate before touching the filesystem so a bad line never lands.
  gateCheck(LINE);
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, LINE, { encoding: "utf8" });
  chmodSync(OUT_FILE, 0o644);

  // Assert mode 0644.
  const mode = statSync(OUT_FILE).mode & 0o777;
  if (mode !== 0o644) {
    throw new Error(`publish: expected mode 0644, got ${mode.toString(8)}`);
  }

  // Read-back verify byte-identical.
  const back = readFileSync(OUT_FILE, "utf8");
  if (back !== LINE) {
    throw new Error("publish: read-back mismatch");
  }
  console.log(`entry.txt written: ${[...back].length} chars`);
}

publish();
