import { test, expect, describe } from "bun:test";
import { lint } from "../../test/helpers";

import manualSome from "./manual-some";

describe("manual-some", () => {
  test("flags for-of returning true/false pattern", () => {
    const d = lint(
      manualSome,
      `
      function hasPositive(arr) {
        for (const x of arr) {
          if (x > 0) return true;
        }
        return false;
      }
    `,
    );
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("some");
  });
});
