import { test, expect, describe } from "bun:test";
import { lint } from "../../test/helpers";

import redundantClosure from "./redundant-closure";

describe("redundant-closure", () => {
  test("flags .map(x => String(x))", () => {
    const d = lint(redundantClosure, `const y = arr.map(x => String(x));`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("redundant_closure");
  });

  test("flags .filter(x => Boolean(x))", () => {
    const d = lint(redundantClosure, `const y = arr.filter(x => Boolean(x));`);
    expect(d.length).toBe(1);
  });

  test("flags .map(x => Number(x))", () => {
    const d = lint(redundantClosure, `const y = arr.map(x => Number(x));`);
    expect(d.length).toBe(1);
  });

  test("flags function expression form", () => {
    const d = lint(redundantClosure, `const y = arr.map(function(x) { return String(x); });`);
    expect(d.length).toBe(1);
  });

  test("ignores .map(x => parseInt(x)) (unsafe — parseInt takes radix)", () => {
    const d = lint(redundantClosure, `const y = arr.map(x => parseInt(x));`);
    expect(d.length).toBe(0);
  });

  test("ignores .map(x => x + 1) (not a single function call)", () => {
    const d = lint(redundantClosure, `const y = arr.map(x => x + 1);`);
    expect(d.length).toBe(0);
  });

  test("ignores .map(x => custom(x)) (unknown function)", () => {
    const d = lint(redundantClosure, `const y = arr.map(x => custom(x));`);
    expect(d.length).toBe(0);
  });
});

describe("redundant-closure (extra coverage)", () => {
  test("flags block-body arrow: x => { return Number(x); }", () => {
    const d = lint(redundantClosure, `const y = arr.map(x => { return Number(x); });`);
    expect(d.length).toBe(1);
  });
});
