import { test, expect, describe } from "bun:test";
import { lint } from "../../test/helpers";

import floatComparison from "./float-comparison";

describe("float-comparison", () => {
  test("flags x === 0.1", () => {
    const d = lint(floatComparison, `if (x === 0.1) {}`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("float_cmp");
  });

  test("flags 0.1 + 0.2 === 0.3", () => {
    const d = lint(floatComparison, `if (0.1 + 0.2 === 0.3) {}`);
    expect(d.length).toBe(1);
  });

  test("flags != with floats", () => {
    const d = lint(floatComparison, `if (x !== 1.5) {}`);
    expect(d.length).toBe(1);
  });

  test("ignores integer comparison", () => {
    const d = lint(floatComparison, `if (x === 1) {}`);
    expect(d.length).toBe(0);
  });

  test("ignores string comparison", () => {
    const d = lint(floatComparison, `if (x === "hello") {}`);
    expect(d.length).toBe(0);
  });
});
