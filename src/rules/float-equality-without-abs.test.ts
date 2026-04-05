import { test, expect, describe } from "bun:test";
import { lint } from "../../test/helpers";

import floatEqualityWithoutAbs from "./float-equality-without-abs";

describe("float-equality-without-abs", () => {
  test("flags (a - b) < epsilon", () => {
    const d = lint(floatEqualityWithoutAbs, `if (a - b < 0.001) {}`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("float_equality_without_abs");
  });

  test("flags (a - b) < Number.EPSILON", () => {
    const d = lint(floatEqualityWithoutAbs, `if (a - b < Number.EPSILON) {}`);
    expect(d.length).toBe(1);
  });

  test("ignores Math.abs(a - b) < epsilon", () => {
    const d = lint(floatEqualityWithoutAbs, `if (Math.abs(a - b) < 0.001) {}`);
    expect(d.length).toBe(0);
  });
});
