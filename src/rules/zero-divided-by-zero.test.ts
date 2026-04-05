import { test, expect, describe } from "bun:test";
import { lint } from "../../test/helpers";

import zeroDividedByZero from "./zero-divided-by-zero";

describe("zero-divided-by-zero", () => {
  test("flags 0 / 0", () => {
    const d = lint(zeroDividedByZero, `const x = 0 / 0;`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("zero_divided_by_zero");
  });

  test("ignores 1 / 0", () => {
    const d = lint(zeroDividedByZero, `const x = 1 / 0;`);
    expect(d.length).toBe(0);
  });
});
