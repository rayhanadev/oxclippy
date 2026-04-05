import { test, expect, describe } from "bun:test";
import { lint } from "../../test/helpers";

import excessiveNesting from "./excessive-nesting";

describe("excessive-nesting", () => {
  test("flags deeply nested code", () => {
    const d = lint(
      excessiveNesting,
      `
      function f(a, b, c, d, e, f) {
        if (a) { if (b) { for (var x of c) { if (d) { while (e) { if (f) { } } } } } }
      }
    `,
    );
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("excessive_nesting");
  });

  test("ignores shallow code", () => {
    const d = lint(
      excessiveNesting,
      `
      function f(x) { if (x) { for (var i of [1]) { console.log(i); } } }
    `,
    );
    expect(d.length).toBe(0);
  });
});

describe("excessive-nesting (extra coverage)", () => {
  test("flags deeply nested arrow function", () => {
    const d = lint(
      excessiveNesting,
      `
      const f = () => {
        if (a) { if (b) { for (var x of c) { if (d) { while (e) { if (f) {} } } } } }
      };
    `,
    );
    expect(d.length).toBe(1);
  });

  test("flags deeply nested function expression", () => {
    const d = lint(
      excessiveNesting,
      `
      const f = function() {
        if (a) { if (b) { for (var x of c) { if (d) { while (e) { if (f) {} } } } } }
      };
    `,
    );
    expect(d.length).toBe(1);
  });

  test("skips nested function bodies", () => {
    const d = lint(
      excessiveNesting,
      `
      function outer() {
        if (a) { if (b) { if (c) { if (d) {
          const inner = () => { if (e) { if (f) {} } };
        } } } }
      }
    `,
    );
    // outer is 4 deep (under threshold), inner is separate
    expect(d.length).toBe(0);
  });
});
