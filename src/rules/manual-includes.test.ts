import { test, expect, describe } from "bun:test";
import { lint } from "../../test/helpers";

import manualIncludes from "./manual-includes";

describe("manual-includes", () => {
  test("flags for-of with equality check", () => {
    const d = lint(
      manualIncludes,
      `
      function contains(arr, val) {
        for (const x of arr) {
          if (x === val) return true;
        }
        return false;
      }
    `,
    );
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("includes");
  });
});
