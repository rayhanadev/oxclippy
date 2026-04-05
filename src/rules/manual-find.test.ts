import { test, expect, describe } from "bun:test";
import { lint } from "../../test/helpers";

import manualFind from "./manual-find";

describe("manual-find", () => {
  test("flags for-of with if-return pattern", () => {
    const d = lint(
      manualFind,
      `
      function f(arr) {
        for (const x of arr) {
          if (x > 5) return x;
        }
        return undefined;
      }
    `,
    );
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("manual_find");
  });

  test("ignores when no default return", () => {
    const d = lint(
      manualFind,
      `
      function f(arr) {
        for (const x of arr) {
          if (x > 5) return x;
        }
      }
    `,
    );
    expect(d.length).toBe(0);
  });
});

describe("manual-find (extra coverage)", () => {
  test("flags for-of with return null after loop", () => {
    const d = lint(
      manualFind,
      `
      function f(arr) {
        for (const x of arr) {
          if (x > 5) return x;
        }
        return null;
      }
    `,
    );
    expect(d.length).toBe(1);
  });

  test("flags for-of with bare return after loop", () => {
    const d = lint(
      manualFind,
      `
      function f(arr) {
        for (const x of arr) {
          if (x > 5) return x;
        }
        return;
      }
    `,
    );
    expect(d.length).toBe(1);
  });
});
