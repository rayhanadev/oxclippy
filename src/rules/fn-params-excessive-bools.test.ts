import { test, expect, describe } from "bun:test";
import { lint } from "../../test/helpers";

import fnParamsExcessiveBools from "./fn-params-excessive-bools";

describe("fn-params-excessive-bools", () => {
  test("flags function with 4 boolean default params", () => {
    const d = lint(
      fnParamsExcessiveBools,
      `
      function create(a = true, b = false, c = true, d = false) {}
    `,
    );
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("excessive_bools");
  });

  test("ignores function with 2 boolean params", () => {
    const d = lint(
      fnParamsExcessiveBools,
      `
      function create(a = true, b = false) {}
    `,
    );
    expect(d.length).toBe(0);
  });
});

describe("fn-params-excessive-bools (extra coverage)", () => {
  test("flags arrow function with excessive bool defaults", () => {
    const d = lint(
      fnParamsExcessiveBools,
      `const f = (a = true, b = false, c = true, d = false) => {};`,
    );
    expect(d.length).toBe(1);
  });

  test("flags function expression with excessive bool defaults", () => {
    const d = lint(
      fnParamsExcessiveBools,
      `const f = function(a = true, b = false, c = true, d = false) {};`,
    );
    expect(d.length).toBe(1);
  });

  test("flags TypeScript boolean type annotations", () => {
    const d = lint(
      fnParamsExcessiveBools,
      `function create(admin: boolean, active: boolean, verified: boolean, notify: boolean) {}`,
    );
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("excessive_bools");
  });

  test("ignores function with 2 TS boolean params", () => {
    const d = lint(fnParamsExcessiveBools, `function create(admin: boolean, active: boolean) {}`);
    expect(d.length).toBe(0);
  });
});
