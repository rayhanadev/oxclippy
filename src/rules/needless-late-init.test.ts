import { test, expect, describe } from "bun:test";
import { lint } from "../../test/helpers";

import needlessLateInit from "./needless-late-init";

describe("needless-late-init", () => {
  test("flags let x; x = expr;", () => {
    const d = lint(needlessLateInit, `{ let x; x = 5; }`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("needless_late_init");
  });

  test("ignores initialized declaration", () => {
    const d = lint(needlessLateInit, `{ let x = 5; }`);
    expect(d.length).toBe(0);
  });
});
