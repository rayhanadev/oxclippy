import { test, expect, describe } from "bun:test";
import { lint } from "../../test/helpers";

import intPlusOne from "./int-plus-one";

describe("int-plus-one", () => {
  test("flags x >= y + 1", () => {
    const d = lint(intPlusOne, `if (x >= y + 1) {}`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("int_plus_one");
  });

  test("flags x + 1 <= y", () => {
    const d = lint(intPlusOne, `if (x + 1 <= y) {}`);
    expect(d.length).toBe(1);
  });

  test("flags x - 1 >= y", () => {
    const d = lint(intPlusOne, `if (x - 1 >= y) {}`);
    expect(d.length).toBe(1);
  });

  test("flags y <= x - 1", () => {
    const d = lint(intPlusOne, `if (y <= x - 1) {}`);
    expect(d.length).toBe(1);
  });

  test("ignores x >= y + 2", () => {
    const d = lint(intPlusOne, `if (x >= y + 2) {}`);
    expect(d.length).toBe(0);
  });
});
