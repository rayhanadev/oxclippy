import { test, expect, describe } from "bun:test";
import { lint } from "../../test/helpers";

import tooManyArguments from "./too-many-arguments";

describe("too-many-arguments", () => {
  test("flags function with 6 params", () => {
    const d = lint(
      tooManyArguments,
      `
      function f(a, b, c, d, e, f) {}
    `,
    );
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("too_many_arguments");
  });

  test("ignores function with 5 params", () => {
    const d = lint(
      tooManyArguments,
      `
      function f(a, b, c, d, e) {}
    `,
    );
    expect(d.length).toBe(0);
  });

  test("flags arrow with 6 params", () => {
    const d = lint(
      tooManyArguments,
      `
      const f = (a, b, c, d, e, f) => {};
    `,
    );
    expect(d.length).toBe(1);
  });
});

describe("too-many-arguments (extra coverage)", () => {
  test("flags function expression with 6 params", () => {
    const d = lint(tooManyArguments, `const f = function(a, b, c, d, e, f) {};`);
    expect(d.length).toBe(1);
  });
});
