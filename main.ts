// One Star for Monday — make.fun entry
// Writes a single-line one-star review of Monday, written as if Monday
// were a restaurant, to /output/entry.txt (or a path given as argv[2]).
//
// Deterministic: no wall-clock reads, no randomness, no network.
// Node 22 stdlib only.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// The review line itself: Monday as the restaurant, the diner seated at
// the worst table, served a cold to-do list for a dish, and billed for
// the whole week — a complaint that only makes sense on a Monday.
const REVIEW: string =
  "Monday sat me at the worst table, served a cold to-do list, and billed me for the whole week. Never again.";

// Gate limits from the bounty: 1-180 characters, at most 25 words,
// a single line of plain text, not only whitespace.
const MIN_CHARS = 1;
const MAX_CHARS = 180;
const MAX_WORDS = 25;

/** Count words the way a reader would: runs of non-whitespace. */
export function countWords(text: string): number {
  const trimmed = text.trim();
  if (trimmed === "") return 0;
  return trimmed.split(/\s+/).length;
}

/** Check the entry against every gate rule; throw on the first failure. */
export function validateEntry(text: string): void {
  if (text.trim() === "") {
    throw new Error("entry must not be only whitespace");
  }
  if (text.length < MIN_CHARS || text.length > MAX_CHARS) {
    throw new Error(
      `entry must be ${MIN_CHARS}-${MAX_CHARS} characters, got ${text.length}`,
    );
  }
  const words = countWords(text);
  if (words > MAX_WORDS) {
    throw new Error(`entry must be at most ${MAX_WORDS} words, got ${words}`);
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
}

/** Write the validated entry as UTF-8 text, creating the folder if needed. */
export function writeEntry(text: string, outPath: string): void {
  validateEntry(text);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, text, "utf8");
}

const DEFAULT_OUTPUT = "/output/entry.txt";

function main(): void {
  const outPath = process.argv[2] ?? DEFAULT_OUTPUT;
  writeEntry(REVIEW, outPath);
}

main();
