import { test, expect, describe } from "bun:test";
import { lint } from "../../test/helpers";

import needlessBool from "./needless-bool";

describe("needless-bool", () => {
  test("flags if/else returning opposing booleans", () => {
    const d = lint(
      needlessBool,
      `
      function f(x) {
        if (x > 0) { return true; } else { return false; }
      }
    `,
    );
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("needless_bool");
  });

  test("flags if/else assigning opposing booleans", () => {
    const d = lint(
      needlessBool,
      `
      function f(x) {
        let ok;
        if (x > 0) { ok = true; } else { ok = false; }
      }
    `,
    );
    expect(d.length).toBe(1);
  });

  test("ignores non-boolean returns", () => {
    const d = lint(
      needlessBool,
      `
      function f(x) {
        if (x > 0) { return 1; } else { return 0; }
      }
    `,
    );
    expect(d.length).toBe(0);
  });

  test("ignores same-side booleans", () => {
    const d = lint(
      needlessBool,
      `
      function f(x) {
        if (x > 0) { return true; } else { return true; }
      }
    `,
    );
    expect(d.length).toBe(0);
  });
});
