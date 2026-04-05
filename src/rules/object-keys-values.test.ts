import { test, expect, describe } from "bun:test";
import { lint } from "../../test/helpers";

import objectKeysValues from "./object-keys-values";

describe("object-keys-values", () => {
  test("flags Object.keys(obj).map(k => obj[k])", () => {
    const d = lint(objectKeysValues, `const vals = Object.keys(obj).map(k => obj[k]);`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("Object.values");
  });

  test("flags Object.keys(obj).forEach(k => use(obj[k]))", () => {
    const d = lint(objectKeysValues, `Object.keys(obj).forEach(k => use(obj[k]));`);
    expect(d.length).toBe(1);
  });

  test("suggests entries when key is also used", () => {
    const d = lint(objectKeysValues, `const pairs = Object.keys(obj).map(k => k + obj[k]);`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("Object.entries");
  });

  test("ignores Object.keys without indexing", () => {
    const d = lint(objectKeysValues, `const keys = Object.keys(obj).map(k => k.toUpperCase());`);
    expect(d.length).toBe(0);
  });
});
