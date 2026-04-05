import { test, expect, describe } from "bun:test";
import { lint } from "../../test/helpers";

import boolComparison from "./bool-comparison";

describe("bool-comparison", () => {
  test("flags x === true", () => {
    const d = lint(boolComparison, `if (x === true) {}`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("use the expression directly");
  });

  test("flags x === false", () => {
    const d = lint(boolComparison, `if (x === false) {}`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("negate");
  });

  test("flags x !== true", () => {
    const d = lint(boolComparison, `if (x !== true) {}`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("negate");
  });

  test("flags x !== false", () => {
    const d = lint(boolComparison, `if (x !== false) {}`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("use the expression directly");
  });

  test("ignores x === 1", () => {
    const d = lint(boolComparison, `if (x === 1) {}`);
    expect(d.length).toBe(0);
  });
});
