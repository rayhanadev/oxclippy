import { test, expect, describe } from "bun:test";
import { lint } from "../../test/helpers";

import manualStrip from "./manual-strip";

describe("manual-strip", () => {
  test("flags startsWith + slice pattern", () => {
    const d = lint(
      manualStrip,
      `
      function f(s) {
        if (s.startsWith("prefix")) {
          return s.slice("prefix".length);
        }
      }
    `,
    );
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("manual_strip");
  });

  test("flags endsWith + slice pattern", () => {
    const d = lint(
      manualStrip,
      `
      function f(s) {
        if (s.endsWith("suffix")) {
          return s.slice(0, -"suffix".length);
        }
      }
    `,
    );
    expect(d.length).toBe(1);
  });

  test("ignores startsWith without slice", () => {
    const d = lint(
      manualStrip,
      `
      function f(s) {
        if (s.startsWith("prefix")) {
          console.log("has prefix");
        }
      }
    `,
    );
    expect(d.length).toBe(0);
  });
});
