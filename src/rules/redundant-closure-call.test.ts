import { test, expect, describe } from "bun:test";
import { lint } from "../../test/helpers";

import redundantClosureCall from "./redundant-closure-call";

describe("redundant-closure-call", () => {
  test("flags (() => expr)()", () => {
    const d = lint(redundantClosureCall, `const x = (() => 42)();`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("redundant_closure_call");
  });

  test("flags (() => { return expr; })()", () => {
    const d = lint(redundantClosureCall, `const x = (() => { return 42; })();`);
    expect(d.length).toBe(1);
  });

  test("flags (function() { return expr; })()", () => {
    const d = lint(redundantClosureCall, `const x = (function() { return 42; })();`);
    expect(d.length).toBe(1);
  });

  test("ignores multi-statement IIFE", () => {
    const d = lint(redundantClosureCall, `const x = (() => { setup(); return 42; })();`);
    expect(d.length).toBe(0);
  });

  test("ignores IIFE with arguments", () => {
    const d = lint(redundantClosureCall, `const x = ((a) => a + 1)(5);`);
    expect(d.length).toBe(0);
  });
});
