// Test fixture: every pattern here should trigger a oxclippy lint.
// Run: oxlint test/fixture.js

// ── needless-bool ──
function isPositive(x) {
  if (x > 0) {
    return true;
  } else {
    return false;
  }
}

// ── collapsible-if ──
function check(a, b) {
  if (a) {
    if (b) {
      console.log("both true");
    }
  }
}

// ── neg-multiply ──
const negated = x * -1;

// ── bool-comparison ──
if (x === true) {
  doThing();
}
if (y !== false) {
  doOther();
}

// ── identity-op ──
const noop1 = x + 0;
const noop2 = x * 1;
const noop3 = x - 0;
const noop4 = x / 1;

// ── single-case-switch ──
switch (color) {
  case "red":
    handleRed();
    break;
}

// ── manual-clamp ──
const clamped = Math.min(100, Math.max(val, 0));

// ── useless-conversion ──
const s = String("already a string");
const n = Number(42);
const b = Boolean(true);
const a = Array.from([1, 2, 3]);

// ── filter-then-first ──
const first = items.filter((x) => x > 5)[0];

// ── map-void-return ──
items.map((x) => console.log(x));

// ── manual-find ──
function findItem(arr) {
  for (const x of arr) {
    if (x.id === targetId) return x;
  }
  return undefined;
}

// ── manual-some ──
function hasNegative(arr) {
  for (const x of arr) {
    if (x < 0) return true;
  }
  return false;
}

// ── manual-every ──
function allValid(arr) {
  for (const x of arr) {
    if (!x.valid) return false;
  }
  return true;
}

// ── manual-includes ──
function contains(arr, target) {
  for (const x of arr) {
    if (x === target) return true;
  }
  return false;
}

// ── manual-strip ──
function stripPrefix(str) {
  if (str.startsWith("https://")) {
    return str.slice("https://".length);
  }
  return str;
}

// ── too-many-arguments ──
function configure(a, b, c, d, e, f, g) {
  return { a, b, c, d, e, f, g };
}
