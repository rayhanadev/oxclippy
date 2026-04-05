import { test, expect, describe } from "bun:test";
import { lint } from "../../test/helpers";

import manualEvery from "./manual-every";

describe("manual-every", () => {
  test("flags for-of returning false/true pattern", () => {
    const d = lint(
      manualEvery,
      `
      function allPositive(arr) {
        for (const x of arr) {
          if (x <= 0) return false;
        }
        return true;
      }
    `,
    );
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("every");
  });
});
