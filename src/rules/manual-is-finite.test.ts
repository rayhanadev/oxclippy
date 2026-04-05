import { test, expect, describe } from "bun:test";
import { lint } from "../../test/helpers";

import manualIsFinite from "./manual-is-finite";

describe("manual-is-finite", () => {
  test("flags x !== Infinity && x !== -Infinity", () => {
    const d = lint(manualIsFinite, `if (x !== Infinity && x !== -Infinity) {}`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("Number.isFinite");
  });

  test("flags x === Infinity || x === -Infinity", () => {
    const d = lint(manualIsFinite, `if (x === Infinity || x === -Infinity) {}`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("isInfinite");
  });

  test("ignores unrelated logic", () => {
    const d = lint(manualIsFinite, `if (x > 0 && x < 100) {}`);
    expect(d.length).toBe(0);
  });
});
