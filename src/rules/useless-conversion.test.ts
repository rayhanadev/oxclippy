import { test, expect, describe } from "bun:test";
import { lint } from "../../test/helpers";

import uselessConversion from "./useless-conversion";

describe("useless-conversion", () => {
  test('flags String("hello")', () => {
    const d = lint(uselessConversion, `const x = String("hello");`);
    expect(d.length).toBe(1);
  });

  test("flags Number(42)", () => {
    const d = lint(uselessConversion, `const x = Number(42);`);
    expect(d.length).toBe(1);
  });

  test("flags Boolean(true)", () => {
    const d = lint(uselessConversion, `const x = Boolean(true);`);
    expect(d.length).toBe(1);
  });

  test("flags Array.from([1,2,3])", () => {
    const d = lint(uselessConversion, `const x = Array.from([1, 2, 3]);`);
    expect(d.length).toBe(1);
  });

  test("ignores Number('42')", () => {
    const d = lint(uselessConversion, `const x = Number("42");`);
    expect(d.length).toBe(0);
  });

  test("ignores String(42)", () => {
    const d = lint(uselessConversion, `const x = String(42);`);
    expect(d.length).toBe(0);
  });
});

describe("useless-conversion (extra coverage)", () => {
  test('flags "str".toString()', () => {
    const d = lint(uselessConversion, `const x = "hello".toString();`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("toString");
  });

  test("flags (42).valueOf()", () => {
    const d = lint(uselessConversion, `const x = (42).valueOf();`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("valueOf");
  });

  test("ignores (42).toString()", () => {
    // Number to string IS a useful conversion
    const d = lint(uselessConversion, `const x = (42).toString();`);
    expect(d.length).toBe(0);
  });
});
